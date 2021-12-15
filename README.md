# ShopeeBot-DN

README INI spesifik untuk yang bukan developer:v

### Cara menggunakan ShopeeBot-DN - Windows

#### STEP 1

1. Klik kanan pada shortcut chrome
2. Klik Properties
3. Tambahkan `--remote-debugging-port=9222` pada field Target di akhir teks. Maka hasilnya akan seperti ini `"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222`
4. Klik Apply
5. Klik OK
6. Restart Chrome atau close Chrome jika sedang terbuka

#### STEP 2

1. install nodejs https://nodejs.org/en/download/
2. install git https://git-scm.com/downloads
3. buka gitbash / CMD
4. ketik `cd Desktop`
5. ketik `git clone https://github.com/devnazir/shopeebot-dn.git`
6. ketik `cd shopeebot-dn`
7. ketik `npm install`

Note: jangan close CMD

#### STEP 3

1. buat file `.env` yang di dalam folder shopeebot-dn
2. copy text yang ada di dalam file `.env.example` ke `.env`
3. ubah text `your-email` menjadi email shopee milik kamu
4. ubah text `your-password` menjadi password shopee milik kamu

#### STEP 4

1. Buka CMD yang masih terbuka
2. lalu ketik `npm start`
3. Tadaaaa browser mu berjalan sendiri
