import employers from './data.js';

const ACTIVE_VIEW_CLASS = 'employers-section__icon-view_active';
const GRID_VIEW = 'grid_view';
const TABLE_VIEW = 'table_rows';

let currentView = localStorage.getItem('task1_view') || GRID_VIEW;
let currentQuery;

const searchForm = document.querySelector('.search-form__input');
const employerList = document.querySelector('.employers-section__list');
const employerCount = document.querySelector('.employers-section__employers-number');
const viewBtns = document.querySelector('.employers-section__employers-view');

searchForm.addEventListener('keyup', analyzeSearchForm)
viewBtns.addEventListener('click', changeView);

function setActiveView() {
    [...viewBtns.children].forEach((view) => {
        if (view.innerText === currentView) {
            view.classList.add(ACTIVE_VIEW_CLASS);
        };
    });
}

function analyzeSearchForm(e) {
    currentQuery = e.target.value.toLocaleLowerCase().trim();
    renderList(filterEmployers(employers));    
}

function renderList(employers) {
    switch (currentView) {
        case GRID_VIEW:
            employerList.innerHTML = renderGridList(employers);
            break;
        case TABLE_VIEW:
            employerList.innerHTML = renderTableList(employers);
            break;
        default:
            break;
    }
}

function filterEmployers(employers) {
    return employers.filter((employer) => {
        return(
            employer.name.toLocaleLowerCase().includes(currentQuery) ||
            employer.nativeName.toLocaleLowerCase().includes(currentQuery)
        );
    });
}

function changeView(e) {
    const selectedView = e.target.innerText;
    let isViewChanged;

    [...viewBtns.children].forEach((view) => {
        if (view.innerText === selectedView && currentView !== selectedView) {
            view.classList.add(ACTIVE_VIEW_CLASS);
            currentView = selectedView;
            isViewChanged = true;

            localStorage.setItem('task1_view', selectedView)

            currentQuery ? renderList(filterEmployers(employers)) : renderList(employers);

        } else if ([...view.classList].includes(ACTIVE_VIEW_CLASS) && ((currentView !== selectedView) || isViewChanged)) {
            view.classList.remove(ACTIVE_VIEW_CLASS);
        }
    });
}

function updateEmployeesCounter({length}) {
    employerCount.innerText = `${length} employeers displayed`;
}

function renderTableList(employers) {
    updateEmployeesCounter(employers);

    const tableHead = ` <thead class="employers-section__list_table-head">
                            <tr>
                                <td class="employers-section__list_table-head-data">
                                    Avatar
                                </td>

                                <td class="employers-section__list_table-head-data">
                                    Name
                                </td>

                                <td class="employers-section__list_table-head-data">
                                    Native name
                                </td>

                                <td class="employers-section__list_table-head-data">
                                    Department
                                </td>
   
                                <td class="employers-section__list_table-head-data">
                                    Room
                                </td>
                            </tr>
                        </thead>`;

    let tableBody = employers.map(employer => {
        return `
        <tr class="employers-section__list_table-row">
            <td class="employers-section__list_table-data">
                <img src='${employer.avatar}' class="employer-card__image" alt='img'>
            </td>

            <td class="employers-section__list_table-data">
                ${employer.name}
            </td>
        
            <td class="employers-section__list_table-data">
                ${employer.nativeName}
            </td>

            <td class="employers-section__list_table-data">
                <i class="material-icons employer-card__info-part-icon">${employer.departmentIcon}</i>
                ${employer.department}
            </td>

            <td class="employers-section__list_table-data">
                <i class="material-icons employer-card__info-part-icon">sensor_door</i>
                ${employer.room}
            </td>
        </tr>
        `
    })
    tableBody = `<tbody class="employers-section__list_table-body">${tableBody.join('')}</tbody>`;


    return `<table class="employers-section__list_table-view"> ${tableHead} ${tableBody} </table>`;
}

function renderGridList(employers) {
    updateEmployeesCounter(employers);

    const employersList = employers.map(employer => {
        return `
        <li class="employer-card">
            <div class="employer-card__content">
                <div class="employer-card__main-part">
                    <img class="employer-card__image" src=${employer.avatar} alt='img'/>
                    <div class="employer-card__name">${employer.name}</div>
                    <div class="employer-card__native-name">${employer.nativeName}</div>
                </div>

                <div class="employer-card__info">
                    <hr class="employer-card__line"></hr>
                    <div class="employer-card__detailed-info">
                        <div class="employer-card__info-part">
                            <i class="material-icons employer-card__info-part-icon">${employer.departmentIcon}</i>
                            <span>${employer.department}</span>
                        </div>
                        <div class="employer-card__info-part">
                            <i class="material-icons employer-card__info-part-icon">sensor_door</i>
                            <span>${employer.room}</span>
                        </div>
                    </div>
                </div>
            </div>
        </li>
        `
    })

    return `<ul class='employers-section__list_grid-view'>${employersList.join('')}</ul>`;
}

window.onload = () => {
    setActiveView();
    renderList(employers);
};