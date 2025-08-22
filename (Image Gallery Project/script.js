// ------------------------------
// Travel Explorer – jQuery App
// ------------------------------
$(function () {
  // ---------------- Data ----------------
  // Fixed Unsplash images (reliable); each item: {id, title, desc, category, src, tags}
  const DATA = [
    // Nature
    {id:1, title:"Beautiful Mountains", desc:"Snow covered peaks under a clear sky.", category:"nature", tags:"mountain snow hill", src:"https://images.unsplash.com/photo-1501785888041-af3ef285b470"},
    {id:2, title:"Sunny Beach", desc:"Golden sands and relaxing waves.", category:"nature", tags:"beach sea ocean coast", src:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e"},
    {id:3, title:"Peaceful Lake", desc:"Still waters reflecting the sky.", category:"nature", tags:"lake water calm mirror", src:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e"},
    {id:4, title:"Desert Dunes", desc:"Endless waves of golden sand.", category:"nature", tags:"desert dunes sand", src:"https://plus.unsplash.com/premium_photo-1681149342564-8bebc9cc4d16?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RGVzZXJ0JTIwRHVuZXN8ZW58MHx8MHx8fDA%3D"},
    // Cities
    {id:5, title:"New York", desc:"The city that never sleeps.", category:"cities", tags:"city skyline nyc", src:"https://images.unsplash.com/photo-1467269204594-9661b134dd2b"},
    {id:6, title:"Paris", desc:"The city of love and lights.", category:"cities", tags:"paris france eiffel", src:"https://images.unsplash.com/photo-1472214103451-9374bd1c798e"},
    {id:7, title:"Tokyo", desc:"Modern city with ancient traditions.", category:"cities", tags:"tokyo japan neon", src:"https://images.unsplash.com/photo-1505761671935-60b3a7427bad"},
    {id:8, title:"Dubai", desc:"Luxury and futuristic skyline.", category:"cities", tags:"dubai uae towers", src:"https://images.unsplash.com/photo-1491553895911-0055eca6402d"},
    // Animals
    {id:9, title:"The King", desc:"A lion resting in the savanna.", category:"animals", tags:"lion animal wildlife", src:"https://media.istockphoto.com/id/498682763/photo/bengal-tiger-getting-photographed-by-people-in-a-jeep.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ul9o_CpktfKewXOeujlZBSL9iNA5P5ZjLpCeTx4vDCA="},
    {id:10, title:"Fierce Tiger", desc:"A majestic tiger in the forest.", category:"animals", tags:"tiger animal cat", src:"https://plus.unsplash.com/premium_photo-1661963380682-8fcaf8ca7650?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmllcmNlJTIwVGlnZXJ8ZW58MHx8MHx8fDA%3D"},
    {id:11, title:"Gentle Giant", desc:"An elephant walking peacefully.", category:"animals", tags:"elephant animal wild", src:"https://images.unsplash.com/photo-1508672019048-805c876b67e2"},
    {id:12, title:"Loyal Friend", desc:"A playful dog outdoors.", category:"animals", tags:"dog puppy pet", src:"https://images.unsplash.com/photo-1518791841217-8f162f1e1131"},
    // Food
    {id:13, title:"Cheese Pizza", desc:"Delicious Italian classic.", category:"food", tags:"pizza food cheese", src:"https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2hlZXNlJTIwUGl6emF8ZW58MHx8MHx8fDA%3D"},
    {id:14, title:"Juicy Burger", desc:"Perfect weekend snack.", category:"food", tags:"burger fastfood", src:"https://images.unsplash.com/photo-1551218808-94e220e084d2"},
    {id:15, title:"Italian Pasta", desc:"Creamy and tasty delight.", category:"food", tags:"pasta italian", src:"https://images.unsplash.com/photo-1504674900247-0877df9cc836"},
    {id:16, title:"Chocolate Cake", desc:"Sweet treat for celebrations.", category:"food", tags:"cake dessert", src:"https://images.unsplash.com/photo-1553621042-f6e147245754"},
    // Cars
    {id:17, title:"Classic Car", desc:"Vintage beauty shining bright.", category:"cars", tags:"classic car oldtimer", src:"https://images.unsplash.com/photo-1502877338535-766e1452684a"},
    {id:18, title:"Sports Car", desc:"A red beast on the highway.", category:"cars", tags:"sports car speed", src:"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d"},
    {id:19, title:"Luxury Ride", desc:"Comfort meets elegance.", category:"cars", tags:"luxury sedan auto", src:"https://images.unsplash.com/photo-1493238792000-8113da705763"},
    {id:20, title:"Offroad Jeep", desc:"Perfect for adventure.", category:"cars", tags:"jeep offroad suv", src:"https://images.unsplash.com/photo-1669437922733-281880fff3b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fE9mZnJvYWQlMjBKZWVwfGVufDB8fDB8fHww"},
  ];

  // ---------------- State ----------------
  const PAGE_SIZE = 12;
  let currentPage = 1;
  let currentCat = "all";
  let currentSort = "az";
  let showFavoritesOnly = false;
  let query = "";

  // Favorites store
  const FAV_KEY = "te:favorites";
  const getFavs = () => JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  const setFavs = (arr) => localStorage.setItem(FAV_KEY, JSON.stringify(arr));

  // ---------------- Helpers ----------------
  const toast = (msg) => {
    const $t = $("#toast").text(msg).addClass("show");
    setTimeout(() => $t.removeClass("show"), 1400);
  };

  const matchesQuery = (item, q) =>
    (item.title + " " + item.desc + " " + item.tags)
      .toLowerCase()
      .includes(q.trim().toLowerCase());

  const sorters = {
    az: (a, b) => a.title.localeCompare(b.title),
    za: (a, b) => b.title.localeCompare(a.title),
  };

  const filted = () => {
    let favs = getFavs();
    return DATA
      .filter(it => (currentCat === "all" ? true : it.category === currentCat))
      .filter(it => (query ? matchesQuery(it, query) : true))
      .filter(it => (showFavoritesOnly ? favs.includes(it.id) : true))
      .sort(sorters[currentSort]);
  };

  // Pagination info
  const pageSlice = (arr) => {
    const totalPages = Math.max(1, Math.ceil(arr.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return { totalPages, items: arr.slice(start, end) };
  };

  // Image element (with lazy load + skeleton)
  const cardHTML = (item, isFav) => `
    <article class="card" data-id="${item.id}">
      <div class="thumb-wrap">
        <img class="thumb" alt="${item.title}" data-src="${item.src}" />
        <span class="badge">${item.category}</span>
        <button class="fav ${isFav ? "active":""}" aria-label="Toggle favorite" title="Favorite">★</button>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
        <div class="card-actions">
          <button class="btn small primary open-modal">View</button>
          <button class="btn small ghost copy-link">Copy Link</button>
        </div>
      </div>
    </article>
  `;

  // Render grid
  const render = () => {
    const favs = getFavs();
    const list = filted();
    const { totalPages, items } = pageSlice(list);

    const html = items.map(it => cardHTML(it, favs.includes(it.id))).join("") || `
      <p style="color:var(--muted);text-align:center;margin:24px 0">No results. Try a different search.</p>
    `;
    $("#grid").html(html);

    // Pagination state
    $("#pageInfo").text(`Page ${totalPages ? currentPage : 0}/${totalPages}`);
    $("#prevPage").prop("disabled", currentPage <= 1);
    $("#nextPage").prop("disabled", currentPage >= totalPages);

    // Lazy load images
    lazyLoad();
  };

  // Lazy loading
  const lazyLoad = () => {
    const imgs = document.querySelectorAll("img.thumb:not(.loaded)");
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const img = entry.target;
          img.src = img.getAttribute("data-src");
          img.onload = () => img.classList.add("loaded");
          io.unobserve(img);
        }
      });
    }, {rootMargin:"150px"});
    imgs.forEach(img => io.observe(img));
  };

  // ---------------- Events ----------------

  // Filters
  $("#categoryFilter").on("change", function(){
    currentCat = $(this).val();
    currentPage = 1;
    render();
  });

  // Sort
  $("#sortBy").on("change", function(){
    currentSort = $(this).val();
    currentPage = 1;
    render();
  });

  // Search (debounced)
  let t;
  $("#searchInput").on("input", function(){
    clearTimeout(t);
    const val = $(this).val();
    t = setTimeout(() => {
      query = val;
      currentPage = 1;
      render();
    }, 200);
  });

  // Favorites toggle view
  $("#showFavs").on("click", function(e){
    e.preventDefault();
    showFavoritesOnly = !showFavoritesOnly;
    $(this).attr("aria-pressed", showFavoritesOnly).text(showFavoritesOnly ? "⭐ Showing Favorites" : "⭐ Favorites");
    currentPage = 1;
    render();
  });

  // Pagination
  $("#prevPage").on("click", () => { currentPage = Math.max(1, currentPage - 1); render(); });
  $("#nextPage").on("click", () => { currentPage = currentPage + 1; render(); });

  // Card action: favorite
  $("#grid").on("click", ".fav", function(){
    const id = +$(this).closest(".card").data("id");
    const favs = getFavs();
    const idx = favs.indexOf(id);
    if(idx === -1){ favs.push(id); $(this).addClass("active"); toast("Added to favorites"); }
    else { favs.splice(idx,1); $(this).removeClass("active"); toast("Removed from favorites"); }
    setFavs(favs);
  });

  // Card action: open modal
  let modalIndex = -1; // index in filtered list
  const openModalAt = (index) => {
    const list = filted();
    if(!list.length) return;
    const item = list[index];
    modalIndex = index;
    $("#modalImg").attr("src", item.src).attr("alt", item.title);
    $("#modalTitle").text(item.title);
    $("#modalDesc").text(item.desc);
    $("#lightbox").attr("aria-hidden", "false");
    $("body").css("overflow","hidden");
    $("#modalClose").focus();
  };

  $("#grid").on("click", ".open-modal, .thumb", function(){
    const id = +$(this).closest(".card").data("id");
    const list = filted();
    const index = list.findIndex(x => x.id === id);
    openModalAt(index);
  });

  // Modal navigation
  $("#modalPrev").on("click", function(){
    const list = filted();
    modalIndex = (modalIndex - 1 + list.length) % list.length;
    openModalAt(modalIndex);
  });
  $("#modalNext").on("click", function(){
    const list = filted();
    modalIndex = (modalIndex + 1) % list.length;
    openModalAt(modalIndex);
  });

  // Modal close
  const closeModal = () => {
    $("#lightbox").attr("aria-hidden","true");
    $("body").css("overflow","");
  };
  $("#modalClose, [data-close-modal]").on("click", closeModal);
  $(document).on("keydown", function(e){
    const open = $("#lightbox").attr("aria-hidden") === "false";
    if(!open) return;
    if(e.key === "Escape") closeModal();
    if(e.key === "ArrowLeft") $("#modalPrev").click();
    if(e.key === "ArrowRight") $("#modalNext").click();
  });

  // Copy link
  $("#grid").on("click", ".copy-link", async function(){
    const id = +$(this).closest(".card").data("id");
    const item = DATA.find(x => x.id === id);
    try{
      await navigator.clipboard.writeText(item.src);
      toast("Image link copied!");
    }catch{
      toast("Copy failed");
    }
  });

  // Theme toggle
  const THEME_KEY = "te:theme";
  const applyTheme = (t) => { document.documentElement.classList.toggle("light", t === "light"); };
  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
  $("#themeToggle").on("click", function(){
    const now = document.documentElement.classList.contains("light") ? "dark" : "light";
    localStorage.setItem(THEME_KEY, now);
    applyTheme(now);
  });

  // Back to top
  const $btt = $("#backToTop");
  $(window).on("scroll", function(){
    if(window.scrollY > 400) $btt.addClass("show"); else $btt.removeClass("show");
  });
  $btt.on("click", () => window.scrollTo({top:0, behavior:"smooth"}));

  // Initial render
  render();
});
