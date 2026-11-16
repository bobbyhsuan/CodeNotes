// CodeNotes：讀取 content/manifest.json 產生左側選單，並用 hash 路由顯示 Markdown 筆記
const $ = (s) => document.querySelector(s);
let manifest;

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function init() {
  manifest = await (await fetch('content/manifest.json')).json();
  document.title = manifest.site;
  window.addEventListener('hashchange', route);
  $('#menu-btn').onclick = () => $('#sidebar').classList.toggle('open');
  route();
}

function renderSidebar(courseId, unitId) {
  let h = `<a class="site" href="#/">${esc(manifest.site)}</a>`;
  for (const c of manifest.courses) {
    h += `<a class="course ${c.id === courseId && !unitId ? 'active' : ''}" href="#/${c.id}">${esc(c.title)}</a>`;
    for (const u of c.units) {
      const on = c.id === courseId && u.id === unitId;
      h += `<a class="unit ${on ? 'active' : ''}" href="#/${c.id}/${u.id}">${esc(u.title)}</a>`;
      if (on) h += '<div class="outline" id="outline"></div>';
    }
  }
  $('#sidebar').innerHTML = h;
  $('#sidebar').classList.remove('open');
}

function renderOutline() {
  const box = $('#outline');
  if (!box) return;
  box.innerHTML = [...document.querySelectorAll('#content h2')]
    .map((el, i) => { el.id = 'sec-' + i; return `<a href="#" data-t="sec-${i}">${esc(el.textContent)}</a>`; })
    .join('');
  box.querySelectorAll('a').forEach((a) => a.onclick = (e) => {
    e.preventDefault();
    document.getElementById(a.dataset.t).scrollIntoView();
  });
}

async function route() {
  const [courseId, unitId] = location.hash.replace(/^#\/?/, '').split('/');
  const course = manifest.courses.find((c) => c.id === courseId);
  const unit = course && course.units.find((u) => u.id === unitId);
  renderSidebar(courseId, unit && unitId);
  const main = $('#content');
  window.scrollTo(0, 0);

  if (unit) {
    const res = await fetch(`content/${course.id}/${unit.id}.md`);
    main.innerHTML = res.ok ? marked.parse(await res.text()) : `<p>找不到筆記檔：content/${course.id}/${unit.id}.md</p>`;
    main.querySelectorAll('blockquote').forEach((b) => { if (b.textContent.includes('難點')) b.classList.add('warn'); });
    renderOutline();
  } else if (course) {
    main.innerHTML = `<h1>${esc(course.title)}</h1><p>${esc(course.summary || '')}</p>` + list(course.units, (u) => `#/${course.id}/${u.id}`);
  } else {
    main.innerHTML = `<h1>${esc(manifest.site)}</h1><p>${esc(manifest.tagline || '')}</p>` + list(manifest.courses, (c) => `#/${c.id}`, (c) => `${c.units.length} 個單元`);
  }
}

function list(items, href, sub) {
  return '<ul class="list">' + items.map((i) =>
    `<li><a href="${href(i)}">${esc(i.title)}<small>${esc((sub ? sub(i) : i.summary) || '')}</small></a></li>`).join('') + '</ul>';
}

init();
