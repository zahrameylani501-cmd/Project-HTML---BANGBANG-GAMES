if (document.body.dataset.page === 'favorite') {
    guardPage();
}
 
// navigasi
const tombolHamburger = document.querySelector('.hamburger .material-symbols-outlined');
const logo = document.querySelector('.logo');
const linkNav = document.querySelector('.nav-links');
const semuaLinkNav = document.querySelectorAll('.nav-links a');
 
const overlayPencarian = document.querySelector('.search-overlay');
const kotakPencarian = document.querySelector('.search');
const tombolTutup = document.querySelector('#close');
const inputPencarian = document.querySelector('.search-input');
const tombolIkonPencarian = document.querySelector('#search-icon-toggle');
const profil = document.querySelector('.profile');
 
// api
const api = 'https://www.freetogame.com/api';
let gameTampil = [];
let favorit = muatFavorit();
 
//filter
const filterPlatform = document.getElementById('platform-filter');
const filterGenre = document.getElementById('genre-filter');
const filterUrutan = document.getElementById('sort-filter');
const kontainerGrid = document.getElementById('grid-container');
const kartuGameTpl = document.getElementById('game-card');
const templateLoading = document.getElementById('loading');
const templateTidakAdaHasil = document.getElementById('no-results-found');
const templateGagal = document.getElementById('failed-to-load');
const templateBelumFavorit = document.getElementById('no-favorites');
 
// navigasi - badge jumlah favorite
const badgeJumlahFavorit = document.getElementById('favorite-count');
 
// navigasi - dropdown profil (logout)
const tombolProfil = document.getElementById('profile-btn');
const dropdownProfil = document.getElementById('profile-dropdown');
 
// navigasi - inisial di bulet profil
const inisialProfil = document.getElementById('profile-initial');
const usernameSaatIni = getCurrentUser();
 
if (inisialProfil) {
    if (usernameSaatIni) {
        inisialProfil.textContent = usernameSaatIni.charAt(0).toUpperCase();
    } else {
        inisialProfil.textContent = '?';
    }
}
 
// detail
const kontainerDetail = document.getElementById('detail-container');
const isiDetail = document.getElementById('detail-body');
const detailDetail = document.getElementById('detail-detail');
const detailError = document.getElementById('detail-error');
 
// render state loading/kosong/gagal ke sebuah container
// langkahnya: 1) kosongin container  2) copy isi template  3) tempel ke container
function tampilkanState(kontainer, template) { 
    kontainer.textContent = ''; 
    const isi = template.firstElementChild.cloneNode(true); 
    kontainer.appendChild(isi); 
}
 
    // MUNCUL NAV KIRI KETIKA KLIK HAMBURGER
    if (tombolHamburger && linkNav) { 
        tombolHamburger.addEventListener('click', () => { 
            linkNav.classList.toggle('active'); 
        });
        // TUTUP KETIKA KLIK DI LUAR HAMBURGER & NAV KIRI
        document.addEventListener('click', (e) => {
            const klikDiDalamHamburger = tombolHamburger.contains(e.target);
            const klikDiDalamNav = linkNav.contains(e.target);
            if (klikDiDalamHamburger === false && klikDiDalamNav === false) {
                linkNav.classList.remove('active');
            }
        });
    }
 
    // MUNCUL/ILANG DROPDOWN LOGOUT KETIKA KLIK IKON PROFIL
    if (tombolProfil && dropdownProfil) {
        tombolProfil.addEventListener('click', (e) => {
        if (!getCurrentUser()) {
            window.location.href = 'login.html';
            return;
        }
            dropdownProfil.classList.toggle('hidden');
            tombolProfil.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            const klikDiDalamDropdown = dropdownProfil.contains(e.target);
            const klikDiDalamTombolProfil = tombolProfil.contains(e.target);
            if (klikDiDalamDropdown === false && klikDiDalamTombolProfil === false) {
                dropdownProfil.classList.add('hidden');
                tombolProfil.classList.remove('active');
            }
        });
    }
 
    // OVERLAY PENCARIAN (HALAMAN EXPLORE GAMES & FAVORITES)
    if (overlayPencarian && kotakPencarian && tombolIkonPencarian && inputPencarian) {
        // KETIKA KLIK tombolIkonPencarian/BUKA SEARCH
        tombolIkonPencarian.addEventListener('click', () => {
            tombolIkonPencarian.style.visibility = 'hidden';
            kotakPencarian.classList.add('active');
            overlayPencarian.classList.add('active');
            inputPencarian.focus();
            tombolHamburger.style.visibility = 'hidden';
            logo.style.visibility = 'hidden';
            profil.style.visibility = 'hidden';
        });
        // TUTUP SEARCH
        document.addEventListener('click', (e) => {
            const searchLagiAktif = kotakPencarian.classList.contains('active');
            const klikDiLuarSearch = kotakPencarian.contains(e.target) === false
                && tombolIkonPencarian.contains(e.target) === false
                && overlayPencarian.contains(e.target) === false;
            const klikTombolClose = tombolTutup && tombolTutup.contains(e.target);
 
            if ((searchLagiAktif && klikDiLuarSearch) || klikTombolClose) {
                tombolIkonPencarian.style.visibility = 'visible';
                kotakPencarian.classList.remove('active');
                overlayPencarian.classList.remove('active');
                tombolHamburger.style.visibility = 'visible';
                logo.style.visibility = 'visible';
                profil.style.visibility = 'visible';
            }
        });
    }
 
// TANDAIN LINK NAV YANG LAGI AKTIF (PAKE FOR)
const halamanSaatIni = window.location.pathname.split('/').pop();
for (let i = 0; i < semuaLinkNav.length; i++) {
    const tautan = semuaLinkNav[i];
    const halamanTautan = tautan.getAttribute('href');
    
    if (halamanTautan === halamanSaatIni) {
        tautan.classList.add('active');
    }
}
 
// FAVORIT
function muatFavorit() {
    try {
        const user = getCurrentUser(); // ambil siapa yang lagi login
        if (!user) return [];
 
        const mentah = localStorage.getItem('gamehub_favorites_' + user); // key-nya jadi unik per-user
        if (mentah) {
            return JSON.parse(mentah);
        } else {
            return [];
        }
    } catch (e) {
        return [];
    }
}
 
function simpanFavorit() {
    const user = getCurrentUser();
    if (!user) return;
    localStorage.setItem('gamehub_favorites_' + user, JSON.stringify(favorit));
}
 
// TAMPILIN ANGKA FAVORITE DI NAV (BADGE)
function tampilkanJumlahFavorit() {
    if (badgeJumlahFavorit) {
        const total = favorit.length;
        badgeJumlahFavorit.textContent = String(total);
        if (total === 0) {
            badgeJumlahFavorit.classList.add('hidden');
        } else {
            badgeJumlahFavorit.classList.remove('hidden');
        }
    }
}
 
function ubahFavorit(id) {
    const indeks = favorit.indexOf(id);
    const sudahFavorit = indeks !== -1;
 
    if (sudahFavorit) {
        favorit.splice(indeks, 1);
        // khusus di halaman favorite: game yang di-unfav langsung ilang dari gameTampil
        if (document.body.dataset.page === 'favorite') {
            gameTampil = gameTampil.filter((g) => g.id !== id);
        }
    } else {
        favorit.push(id);
    }
    simpanFavorit();
    tampilkanJumlahFavorit();
    tampilkanGrid();
}
 
// AMBIL DATA GAME
// Dipake buat 2 halaman:
// - halaman biasa: pakaiFilter = true  -> ambil semua game sesuai filter dropdown
// - halaman favorite: pakaiFilter = false -> ambil semua game, terus disaring cuma yang difavoritin
async function muatGame(pakaiFilter) {
    if (kontainerGrid && templateLoading) {
        tampilkanState(kontainerGrid, templateLoading);
 
        try {
            let url = api + '/games';
 
            if (pakaiFilter) {
                let platform = 'all';
                if (filterPlatform) platform = filterPlatform.value;
 
                let genre = 'all';
                if (filterGenre) genre = filterGenre.value;
 
                let urutan = 'release-date';
                if (filterUrutan) urutan = filterUrutan.value;
 
                url += '?sort-by=' + urutan;
                if (platform !== 'all') url += '&platform=' + platform;
                if (genre !== 'all') url += '&genre=' + genre;
            }
 
            const respons = await fetch(url);
            if (respons.ok === false) {
                throw new Error('Failed to fetch data');
            }
 
            const semuaGame = await respons.json();
 
            if (pakaiFilter) {
                gameTampil = semuaGame;
            } else {
                gameTampil = semuaGame.filter((g) => favorit.includes(g.id));
            }
 
            tampilkanGrid();
        } catch (err) {
            tampilkanState(kontainerGrid, templateGagal);
            console.error(err);
        }
    }
}
 
// BIKIN CARD GAME
function buatKartu(game) {
    const kartu = kartuGameTpl.querySelector('.card').cloneNode(true);
    kartu.dataset.id = game.id;
 
    const gambar = kartu.querySelector('.thumbnail-image');
    gambar.src = game.thumbnail;
    gambar.alt = game.title;
 
    kartu.querySelector('.thumbnail-genre').textContent = game.genre;
 
    const sudahDifavoritkan = favorit.includes(game.id);
    const tombolFavorit = kartu.querySelector('.thumbnail-favorite');
    tombolFavorit.dataset.id = game.id;
    if (sudahDifavoritkan) {
        tombolFavorit.classList.add('active');
        tombolFavorit.textContent = '♥';
    } else {
        tombolFavorit.classList.remove('active');
        tombolFavorit.textContent = '♡';
    }
    tombolFavorit.addEventListener('click', (e) => {
        e.stopPropagation();
        // KALO BELUM LOGIN, ARAHIN KE LOGIN DULU, JANGAN LANGSUNG TOGGLE FAVORIT
        if (!getCurrentUser()) {
            window.location.href = 'login.html';
            return;
        }
        ubahFavorit(game.id);
    });
 
    kartu.querySelector('.thumbnail-title').textContent = game.title;
    kartu.querySelector('.thumbnail-platform').textContent = game.platform;
    kartu.querySelector('.thumbnail-publisher').textContent = game.publisher;
    kartu.querySelector('.thumbnail-desc').textContent = game.short_description;
 
    kartu.addEventListener('click', () => tampilkanDetail(game.id));
    kartu.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') tampilkanDetail(game.id);
    });
 
    return kartu;
}
 
// TAMPILKAN GRID GAME
function tampilkanGrid() {
    let kataKunci = '';
    if (inputPencarian) kataKunci = inputPencarian.value.trim().toLowerCase();
 
    const gameTerlihat = gameTampil.filter((g) => g.title.toLowerCase().includes(kataKunci));
 
    kontainerGrid.textContent = '';
 
    if (gameTerlihat.length === 0) {
        const halamanSekarang = document.body.dataset.page;
 
        if (halamanSekarang === 'favorite' && favorit.length === 0) {
            tampilkanState(kontainerGrid, templateBelumFavorit); // belum pernah fav sama sekali
        } else {
            tampilkanState(kontainerGrid, templateTidakAdaHasil);
        }
    } else {
        let i = 0;
        while (i < gameTerlihat.length) {
            kontainerGrid.appendChild(buatKartu(gameTerlihat[i]));
            i++;
        }
    }
}
 
// MODAL DETAIL
function tutupModal() {
    if (kontainerDetail) kontainerDetail.classList.remove('open');
}
 
async function tampilkanDetail(id) {
    if (kontainerDetail && isiDetail) {
        tampilkanState(isiDetail, templateLoading);
        kontainerDetail.classList.add('open');
 
        try {
            const respons = await fetch(api + '/game?id=' + id);
            if (respons.ok === false) {
                throw new Error('Failed to fetch data');
            }
 
            const game = await respons.json();
            const elemenDetail = detailDetail.firstElementChild.cloneNode(true);
 
            let urlScreenshot = game.thumbnail;
            if (game.screenshots && game.screenshots[0]) {
                urlScreenshot = game.screenshots[0].image;
            }
 
            const gambarDetail = elemenDetail.querySelector('.detail-img');
            gambarDetail.src = urlScreenshot;
            gambarDetail.alt = game.title;
 
            elemenDetail.querySelector('.detail-title').textContent = game.title;
            elemenDetail.querySelector('.tag-genre').textContent = game.genre;
            elemenDetail.querySelector('.tag-platform').textContent = game.platform;
            elemenDetail.querySelector('.tag-publisher').textContent = game.publisher;
            elemenDetail.querySelector('.desc').textContent = game.description;
 
            elemenDetail.querySelector('[data-fact="developer"]').textContent = game.developer;
            elemenDetail.querySelector('[data-fact="release_date"]').textContent = game.release_date;
            elemenDetail.querySelector('[data-fact="publisher"]').textContent = game.publisher;
            elemenDetail.querySelector('[data-fact="platform"]').textContent = game.platform;
 
            elemenDetail.querySelector('.play').href = game.game_url;
 
            isiDetail.textContent = '';
            isiDetail.appendChild(elemenDetail);
            elemenDetail.querySelector('.close-btn').addEventListener('click', tutupModal);
        } catch (err) {
            const elemenError = detailError.firstElementChild.cloneNode(true);
            isiDetail.textContent = '';
            isiDetail.appendChild(elemenError);
            elemenError.querySelector('.close-btn').addEventListener('click', tutupModal);
            console.error(err);
        }
    }
}
 
if (kontainerDetail) {
    kontainerDetail.addEventListener('click', (e) => {
        if (e.target === kontainerDetail) {
            tutupModal();
        }
    });
}
 
// BACK TO TOP
const tombolKeAtas = document.createElement('button');
tombolKeAtas.id = 'back-to-top';
tombolKeAtas.className = 'back-to-top';
tombolKeAtas.setAttribute('aria-label', 'Kembali ke atas');

const ikonKeAtas = document.createElement('span');
ikonKeAtas.className = 'material-symbols-outlined';
ikonKeAtas.textContent = 'arrow_upward';

tombolKeAtas.appendChild(ikonKeAtas);
document.body.appendChild(tombolKeAtas);

if (tombolKeAtas) {
    // MUNCUL/ILANG SESUAI POSISI SCROLL
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            tombolKeAtas.classList.add('show');
        } else {
            tombolKeAtas.classList.remove('show');
        }
    });
    // KLIK -> SCROLL HALUS KE ATAS
    tombolKeAtas.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
 
// TAMPILIN BADGE FAVORITE DI SETIAP HALAMAN YANG PUNYA NAV
tampilkanJumlahFavorit();
 
// JALANIN SESUAI HALAMAN (PALING BAWAH, SETELAH SEMUA SIAP)
const tipeHalamanSaatIni = document.body.dataset.page;
 
if (tipeHalamanSaatIni === 'favorite') {
    muatGame(false);
} else {
    muatGame(true);
    if (filterPlatform) filterPlatform.addEventListener('change', () => muatGame(true));
    if (filterGenre) filterGenre.addEventListener('change', () => muatGame(true));
    if (filterUrutan) filterUrutan.addEventListener('change', () => muatGame(true));
}
 
if (inputPencarian) {
    inputPencarian.addEventListener('input', tampilkanGrid);
}
 