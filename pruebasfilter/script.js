let listTools = [];
let listToolsFiltered = []
let buttonsIds = []
let toolsFilterSearch = []
let arrayItemsForSearch = [];
let arrayFilterSearch = []
let arrayKeywords = []

const searchBar = document.querySelector('.tools__search-container');
const inputSearch = document.querySelector('#input-search')
const listSearch = document.querySelector('.tools__search-box')
const elementsSearchFilter = listSearch.children;
const containerCardsTools = document.querySelector('.tools__cards-container');
const cardsElements = containerCardsTools.children;
const pushables = document.querySelectorAll(".pushable");
const arrayBackgroundGradients = [
    "tools-gradient-one",
    "tools-gradient-two",
    "tools-gradient-three",
    "tools-gradient-four",
    "tools-gradient-five",
    "tools-gradient-six",
    "tools-gradient-seven",
    "tools-gradient-eigth"
]

// Function que lee los archivos json y los guarda en un array
async function fetchDataTools() {
    const response = await fetch('http://127.0.0.1:5500/tools.json')
    return await response.json()
}

// Function que ejecuta el slider de buttons, ejecuta el fetch y renderiza los cards y los elementos li del search de busqueda

window.addEventListener('load', async function () {
    new Glider(document.querySelector('.tools__carrousel-lista'), {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: '.tools__indicadores',
        arrows: {
            prev: '.carrousel-anterior',
            next: '.carrousel-siguiente'
        },
        responsive: [
            {
                // screens greater than >= 775px
                breakpoint: 450,
                settings: {
                    // Set to `auto` and provide item width to adjust to viewport
                    slidesToShow: '2',
                    slidesToScroll: '2',
                }
            },
            {
                // screens greater than >= 775px
                breakpoint: 600,
                settings: {
                    // Set to `auto` and provide item width to adjust to viewport
                    slidesToShow: '3',
                    slidesToScroll: '3',
                }
            },
            {
                // screens greater than >= 775px
                breakpoint: 800,
                settings: {
                    // Set to `auto` and provide item width to adjust to viewport
                    slidesToShow: '4',
                    slidesToScroll: '4',
                }
            }, {
                // screens greater than >= 1024px
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,

                }
            }
        ]
    })
    const data = await fetchDataTools()
    listTools = data;
    renderCardsTools(listTools)
    namesAndKWForSearch(listTools)
    clickForItemSearch()
})


// Function que asigna gradientes aleatorios a los cards
function gradientAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)]
}

// Function que renderiza los cards
function renderCardsTools(tools) {
    for (let i = 0; i < tools.length; i++) {
        let fragmentHTMLCardsTools = `
        <div class="tools__cards-bg  ${gradientAleatorio(arrayBackgroundGradients)}" id="${tools[i].PropertyID}">
            <div class="tools__cards">
                <div class="tools__cards-heading">
                    <h1>${tools[i].Name}</h1>
                    <svg fill="black" class="tools__heart" id="" height="40" width="40"
                    viewBox="0 0 24 24">
                        <path
                            d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z">
                        <path>
                    </svg>
                </div>
                <div class="tools__cards-description">
                        <h3>Description:</h3>
                        <p class="tools__description-ellipsis">${tools[i].DescriptionEnglish}</p>
                        <img class="tools__description-arrow" src="/img/chevron-down-solid.svg" alt="">
                        <a target="_blank" href="${tools[i].Link}">Link</a>
                </div>
            </div>
        </div>`
        containerCardsTools.innerHTML += fragmentHTMLCardsTools
    }
}

// Funciones que activan y desactivan los botones para el filtrado de los cards

pushables.forEach(pushable => {
    pushable.addEventListener("click", function (e) {
        let childPushable = pushable.childNodes[5];
        childPushable.classList.toggle("tool-btn-active");
        const idButton = pushable.getAttribute('data-id');
        if (childPushable.classList.contains("tool-btn-active")) {
            buttonsIds.push(idButton)
            arrayFilteredTools(buttonsIds)
        } else {
            buttonsIds = buttonsIds.filter(id => id !== idButton);
            if (buttonsIds.length == 0) {
                visibleCards(listTools)
            } else {
                buttonsIds = buttonsIds.filter(id => id !== idButton);
                arrayFilteredTools(buttonsIds)

            }
        }

    });
})

function arrayFilteredTools(tools) {
    listToolsFiltered = []
    tools.forEach(id => {
        listTools.filter(tool => {
            tool.Categories.forEach(category => {
                if (category === id && !listToolsFiltered.includes(tool)) {
                    listToolsFiltered.push(tool)
                } else {
                    hiddenCardsTools(tool)
                }
            })
        })
    })
    visibleCards(listToolsFiltered)
}

function hiddenCardsTools(tool) {
    const toolCard = document.getElementById(tool.PropertyID);
    toolCard.classList.add('hidden');
}
function visibleCards(tools) {
    tools.forEach(tool => {
        const toolCard = document.getElementById(tool.PropertyID);
        if (toolCard.classList.contains('hidden')) {
            toolCard.classList.remove('hidden');
        }
    })
}


//Functions de Heart y Arrow

containerCardsTools.addEventListener('click', (e) => {
    heartCardToolsActive(e);
    arrowCardToolsActive(e);
})

function heartCardToolsActive(e) {
    if (e.target.classList.contains('tools__heart')) {
        const heartIcon = e.path[0];
        const pathHeartIcon = heartIcon.childNodes[1];
        heartIcon.removeAttribute('viewBox');
        heartIcon.setAttribute('viewBox', '0 0 48 48')
        heartIcon.removeAttribute('fill');
        heartIcon.setAttribute('fill', '#ed4956')
        pathHeartIcon.removeAttribute('d');
        pathHeartIcon.setAttribute('d', "M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z");
        heartIcon.classList.remove('heart-main');
        pathHeartIcon.classList.add('path')
    } else if (e.target.classList.contains('path')) {
        const pathHeartIcon = e.path[0];
        const heartIcon = pathHeartIcon.parentNode;
        pathHeartIcon.removeAttribute('d');
        pathHeartIcon.setAttribute('d', "M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z");
        heartIcon.removeAttribute('viewBox');
        heartIcon.setAttribute('viewBox', '0 0 24 24')
        heartIcon.removeAttribute('fill');
        heartIcon.setAttribute('fill', 'black');
        heartIcon.classList.add('heart-main');
        pathHeartIcon.classList.remove('path');
    };
}


function arrowCardToolsActive(e) {
    if (e.target.classList.contains('tools__description-arrow')) {
        const arrowToolsDescription = e.path[0];
        const description = arrowToolsDescription.parentNode;
        const descriptionText = description.childNodes[3];
        descriptionText.classList.toggle('tools__description-ellipsis');
        arrowToolsDescription.classList.toggle('tools__arrow-rotate');
    }
}


//Function para renderizado y Filtrado con Search de Busqueda

function namesAndKWForSearch(tools) {
    tools.forEach(tool => {
        if (tool.Name !== null && tool.KeyWords !== null) {
            if (!arrayItemsForSearch.includes(tool.Name)) {
                arrayItemsForSearch.push(tool.Name)
                tool.KeyWords.forEach(keyword => {
                    if (!arrayItemsForSearch.includes(keyword)) {
                        arrayItemsForSearch.push(keyword)
                    }
                })
            }
        }

    })
    renderItemsForSearch(arrayItemsForSearch)
}


function renderItemsForSearch(tools) {
    for (let i = 0; i < tools.length; i++) {
        let fragmentSearch = `
         <li>
            <img src="/img/WhatsApp Image 2022-06-24 at 1.38.53 PM.jpg" alt="">${tools[i]}
        </li>`

        listSearch.innerHTML += fragmentSearch
    }
}

function clickForItemSearch() {
    for (let i = 0; i < elementsSearchFilter.length; i++) {
        elementsSearchFilter[i].addEventListener('click', (e) => {
            const text = e.target.innerText.toLowerCase();
            inputSearch.value = text;
            arrayKeywords.push(text);
            arrayFilteredToolsSearch(arrayKeywords);
            arrayKeywords = []
            listSearch.style.display = 'none';
        })
    }
}

function search() {
    listSearch.style.display = 'block';
    const inputSearchValue = inputSearch.value.toLowerCase();
    const elementsSearch = listSearch.getElementsByTagName('li');
    for (let i = 0; i < elementsSearch.length; i++) {
        const elementText = elementsSearch[i].textContent || elementsSearch[i].innerText;
        if (elementText.toLowerCase().indexOf(inputSearchValue) > -1) {
            elementsSearch[i].style.display = '';
            if (inputSearchValue === "") {
                listSearch.style.display = 'none';
                visibleCards(listTools)
            }
        } else {
            elementsSearch[i].style.display = 'none';
        }
    }
}

function arrayFilteredToolsSearch(tools) {
    toolsFilterSearch = []
    tools.forEach(id => {
        listTools.forEach(tool => {
            if (tool.Name !== null && tool.KeyWords !== null) {
                let keywords = tool.KeyWords.join(' ')
                let names = tool.Name.toLowerCase()
                if (keywords.toLowerCase().indexOf(id) > -1 || names.includes(id)) {
                    toolsFilterSearch.push(tool)
                } else {
                    hiddenCardsTools(tool)
                }
            } else {
                hiddenCardsTools(tool)
            }
        })

    })
    visibleCards(toolsFilterSearch)
}

inputSearch.addEventListener('keyup', search)

