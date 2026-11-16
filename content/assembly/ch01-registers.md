# 第 1 章 暫存器與基本指令

> **來源講義**：sources/assembly/ch01.pdf（範例，請換成實際講義）

## 通用暫存器

### 32 位元 x86
- `EAX`、`EBX`、`ECX`、`EDX`：通用資料暫存器。
- `ESI`、`EDI`：常用於字串與陣列操作。
- `ESP`、`EBP`：堆疊指標與基底指標。

## 基本指令

### 資料搬移與運算
- `MOV dest, src`：把 src 複製到 dest，兩個運算元不能同時是記憶體。
- `ADD dest, src`：dest = dest + src。
- `SUB dest, src`：dest = dest - src。

```asm
mov eax, 5
add eax, 3    ; eax = 8
```

> ⚠️ **難點**：Intel 語法是「目的在左、來源在右」，AT&T 語法則相反，閱讀不同範例時要先確認語法。

> 📖 **書中對應**：[書名 p.20](books/assembly/book.pdf#page=20)（範例連結，請換成實際書籍檔名與頁碼）
