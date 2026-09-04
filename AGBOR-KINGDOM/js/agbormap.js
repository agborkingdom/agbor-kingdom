document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Setup
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileSideMenu = document.getElementById('mobileSideMenu');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

  function openMobileMenu() {
    mobileSideMenu?.classList.add('active');
    mobileMenuOverlay?.classList.add('active');
  }

  function closeMobileMenu() {
    mobileSideMenu?.classList.remove('active');
    mobileMenuOverlay?.classList.remove('active');
  }

  mobileMenuButton?.addEventListener('click', openMobileMenu);
  mobileMenuClose?.addEventListener('click', closeMobileMenu);
  mobileMenuOverlay?.addEventListener('click', closeMobileMenu);

  // =========================================================================
  // LOCATION DATA ARRAY
  // Add new Cities, Towns, or Villages here with custom coordinates & Google Maps URLs
  // =========================================================================
  const locations = [
    {
      id: 'agbor-obi',
      name: 'Ime-Obi',
      subtitle: 'Royal Capital Town',
      type: 'Town',
      icon: 'landmark',
      position: { left: '50%', top: '42%' },
      tagline: 'Royal Seat',
      description: "Ime-Obi is the traditional seat of power and historical center of Agbor Kingdom. It houses the Palace of the Dein of Agbor (Dein's Royal Palace), ancestral heritage, and deep customs.",
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Agbor-Obi+Delta+State'
    },
    {
      id: 'boji-boji',
      name: 'Boji-Boji Agbor',
      subtitle: 'Commercial Center',
      type: 'City',
      icon: 'shopping-bag',
      position: { left: '65%', top: '32%' },
      tagline: 'Commercial Hub',
      description: 'Boji-Boji serves as the bustling economic heart of Agbor. It hosts major commercial markets, financial institutions, transit hubs, and connects local traders across Delta State.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Boji+Boji+Agbor+Delta+State'
    },
    {

         id: 'Ihu-Iyase',
      name: 'Ihu-Iyase Agbor',
      subtitle: 'Artifact Center',
      type: 'Village',
      icon: 'Clay-Jar',
      position: { left: '15%', top: '20%' },
      tagline: 'Agricultural Center',
      description: 'Ihu-Iyase serves as the prominent heart of Artifacts in Agbor. ',
      mapUrl: 'https://maps.app.goo.gl/wW3RB4dQuXqeEzLo8'
    },
    {

      id: 'asaba-city',
      name: 'Asaba Metropolis',
      subtitle: 'Capital Gateway City',
      type: 'City',
      icon: 'building-2',
      position: { left: '88%', top: '22%' },
      tagline: 'Regional City',
      description: 'Asaba is the capital city of Delta State located along the Niger River. It serves as a major administrative hub connecting Agbor Kingdom to the eastern transit corridor.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Asaba+Delta+State'
    },
    {
      id: 'ekuku-agbor',
      name: 'Ekuku-Agbor',
      subtitle: 'Historic Farming Village',
      type: 'Village',
      icon: 'sprout',
      position: { left: '30%', top: '78%' },
      tagline: 'Agricultural Center',
      description: 'Ekuku-Agbor is one of the prominent agricultural powerhouses of the kingdom, renowned for its fertile soils, palm oil production, yam harvests, and cultural festivals.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ekuku-Agbor+Delta+State'
    },
    {
      id: 'emuhu',
      name: 'Emuhu',
      subtitle: 'Border Transit Highway',
      type: 'Town',
      icon: 'navigation',
      position: { left: '18%', top: '45%' },
      tagline: 'Gateway Community',
      description: 'Situated along the main expressway axis, Emuhu connects Agbor to neighbouring regions toward Benin City, serving as an important transit gateway.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Emuhu+Delta+State'
    },
    {
      id: 'oza-nogogo',
      name: 'Oza-Nogogo',
      subtitle: 'Hilly Cultural Haven',
      type: 'Village',
      icon: 'mountain',
      position: { left: '80%', top: '28%' },
      tagline: 'Cultural Haven',
      description: 'Famous for its unique dialect, elevated scenic landscape, and distinct heritage, Oza-Nogogo stands out as a vibrant and culturally rich community.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Oza-Nogogo+Delta+State'
    },
    {
      id: 'alihame',
      name: 'Alihame',
      subtitle: 'Educational Hub',
      type: 'Town',
      icon: 'graduation-cap',
      position: { left: '38%', top: '30%' },
      tagline: 'Academic Sector',
      description: 'Home to key academic installations and peaceful residential sectors, Alihame seamlessly links modern education with traditional community life.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Alihame+Agbor+Delta+State'
    },
    {
      id: 'owa-alero',
      name: 'Owa-Alero Border',
      subtitle: 'Neighboring Settlement',
      type: 'Village',
      icon: 'home',
      position: { left: '72%', top: '65%' },
      tagline: 'Border Axis',
      description: 'A vital crossroad connecting Agbor Kingdom to its neighbouring Ika communities, fostering vibrant local markets, trade, and shared culture.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Owa+Alero+Delta+State'
    }
  ];

  // DOM Elements
  const communityListContainer = document.getElementById('community-list');
  const pinsContainer = document.getElementById('pins-container');
  const detailsContainer = document.getElementById('details-container');
  const communityCountEl = document.getElementById('community-count');
  const searchInput = document.getElementById('community-search');
  const filterContainer = document.getElementById('filter-container');
  const noResultsText = document.getElementById('no-results');
  const resetButton = document.getElementById('reset-map');

  let activeFilter = 'all';

  // Render Default Welcome Card + Location Detail Cards
  function renderDetails() {
    let detailsHTML = `
      <div id="detail-default" class="detail-card active">
        <span class="inline-flex p-3 rounded-full bg-[#d7ae58] text-[#163b35]">
          <i data-lucide="sparkles" class="w-5 h-5"></i>
        </span>
        <h2 class="display text-xl mt-4 font-semibold">Welcome to Agbor</h2>
        <p class="mt-2 text-sm leading-relaxed text-white/75">
          Select any town, city, or village pin from the directory or map to view details and open direct GPS map locations.
        </p>
      </div>
    `;

    locations.forEach(loc => {
      detailsHTML += `
        <article id="detail-${loc.id}" class="detail-card hidden">
          <div class="flex items-center justify-between">
            <span class="text-xs uppercase tracking-widest text-[#e4c67e] font-bold">${loc.tagline}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-white/90 border border-white/20">${loc.type}</span>
          </div>
          <h2 class="display text-2xl mt-1 font-semibold">${loc.name}</h2>
          <p class="mt-3 text-sm text-white/80 leading-relaxed">${loc.description}</p>
          
          <!-- Direct Google Map External Link Button -->
          <a href="${loc.mapUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 mt-6 px-4 py-2.5 bg-[#d7ae58] text-[#163b35] font-bold text-xs rounded-lg hover:bg-[#e4c67e] transition shadow">
            <i data-lucide="map-pin" class="w-4 h-4"></i> View Google Map Location
            <i data-lucide="external-link" class="w-3.5 h-3.5 opacity-70"></i>
          </a>
        </article>
      `;
    });

    detailsContainer.innerHTML = detailsHTML;
  }

  // Render Directory Cards and Map Pins
  function renderInterface() {
    renderDetails();

    let listHTML = '';
    let pinsHTML = '';

    locations.forEach(loc => {
      // Render Directory Items with Direct Map Links
      listHTML += `
        <div class="community-card w-full flex items-center justify-between p-3 rounded-xl border border-[#ece6da] bg-white transition hover:border-[#d7ae58]" data-id="${loc.id}" data-type="${loc.type}">
          <button type="button" class="select-community-btn text-left flex-1" data-id="${loc.id}">
            <span class="block font-bold text-sm text-[#163b35]">${loc.name}</span>
            <span class="text-xs text-[#758882]">${loc.subtitle}</span>
          </button>
          
          <a href="${loc.mapUrl}" target="_blank" rel="noopener noreferrer" class="p-2 text-[#a4772b] hover:text-[#163b35] hover:bg-[#f4efe5] rounded-lg transition" title="Open Map Location">
            <i data-lucide="external-link" class="w-4 h-4"></i>
          </a>
        </div>
      `;

      // Render Map Pins
      pinsHTML += `
        <button class="map-pin" style="left:${loc.position.left}; top:${loc.position.top};" type="button" data-id="${loc.id}" data-type="${loc.type}" aria-label="Select ${loc.name}">
          <span class="pin-dot"><i data-lucide="${loc.icon}"></i></span>
          <span class="pin-label">${loc.name}</span>
        </button>
      `;
    });

    communityListContainer.innerHTML = listHTML;
    pinsContainer.innerHTML = pinsHTML;

    // Refresh Lucide Icons
    lucide.createIcons();

    // Attach Event Handlers
    attachEvents();
    filterLocations();
  }

  // Event Handlers for Selection and Filtering
  function attachEvents() {
    document.querySelectorAll('.select-community-btn').forEach(btn => {
      btn.addEventListener('click', () => selectLocation(btn.dataset.id));
    });

    document.querySelectorAll('.map-pin').forEach(pin => {
      pin.addEventListener('click', () => selectLocation(pin.dataset.id));
    });
  }

  function selectLocation(id) {
    document.querySelectorAll('.detail-card').forEach(card => card.classList.add('hidden'));
    document.querySelectorAll('.detail-card').forEach(card => card.classList.remove('active'));

    const targetDetail = document.getElementById(`detail-${id}`);
    if (targetDetail) {
      targetDetail.classList.remove('hidden');
      targetDetail.classList.add('active');
    }

    document.querySelectorAll('.community-card').forEach(card => {
      card.classList.toggle('active', card.dataset.id === id);
    });

    document.querySelectorAll('.map-pin').forEach(pin => {
      pin.classList.toggle('selected', pin.dataset.id === id);
    });
  }

  function filterLocations() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    locations.forEach(loc => {
      const nameMatch = loc.name.toLowerCase().includes(searchTerm) || loc.subtitle.toLowerCase().includes(searchTerm);
      const typeMatch = activeFilter === 'all' || loc.type === activeFilter;
      const isVisible = nameMatch && typeMatch;

      const card = document.querySelector(`.community-card[data-id="${loc.id}"]`);
      const pin = document.querySelector(`.map-pin[data-id="${loc.id}"]`);

      if (card) card.classList.toggle('hidden', !isVisible);
      if (pin) pin.classList.toggle('hidden', !isVisible);

      if (isVisible) visibleCount++;
    });

    communityCountEl.textContent = `${visibleCount} Places`;
    noResultsText.classList.toggle('hidden', visibleCount !== 0);
  }

  function resetView() {
    searchInput.value = '';
    activeFilter = 'all';

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === 'all');
    });

    document.querySelectorAll('.detail-card').forEach(card => card.classList.add('hidden'));
    const defaultCard = document.getElementById('detail-default');
    if (defaultCard) {
      defaultCard.classList.remove('hidden');
      defaultCard.classList.add('active');
    }

    document.querySelectorAll('.community-card').forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.map-pin').forEach(pin => pin.classList.remove('selected'));

    filterLocations();
  }

  // Filter Event Listeners
  filterContainer?.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    filterLocations();
  });

  searchInput?.addEventListener('input', filterLocations);
  resetButton?.addEventListener('click', resetView);

  // Initial Execution
  renderInterface();
});