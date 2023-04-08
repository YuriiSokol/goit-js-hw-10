import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

input.addEventListener(
  'input',
  debounce(() => {
    onInput(input.value.trim());
  }, DEBOUNCE_DELAY)
);

const clearResult = () => {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
};

const checkCountriesQuantity = req => {
  if (req.length > 10) {
    clearResult();
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (req.length < 10 && req.length > 1) return render10Countries(req);
  if (req.length === 1) return renderOneCountry(req);
};

const onInput = input => {
  if (/[0-9]/.test(input)) {
    Notiflix.Notify.failure('Please enter correct country name');
    return;
  }
  if (input === '') {
    clearResult();
    return;
  }
  fetchCountries(input)
    .then(req => {
      checkCountriesQuantity(req);
    })
    .catch(() => {
      clearResult();
      Notiflix.Notify.failure('Oops, there is no country with that name.');
    });
};

const render10Countries = req => {
  clearResult();
  countryList.insertAdjacentHTML(
    'beforeend',
    req
      .map(elem => {
        const svgLink = elem.flags.svg;
        const name = elem.name.official;
        return `<li class='country-list__element' > <img class='country-elem__image' src='${svgLink}' alt="country flag"  height='50' width='50' "/> <p class='country-elem__text'>${name}</p> </li>`;
      })
      .join('')
  );
};
const renderOneCountry = req => {
  clearResult();
  const element = req
    .map(elem => {
      const svgLink = elem.flags.svg;
      const name = elem.name.common;
      let languagesList = '';
      const languagesArr = Object.values(elem.languages);
      languagesArr.map(element => {
        if (languagesArr.indexOf(element) === languagesArr.length - 1) {
          languagesList = languagesList + element;
          return;
        }
        languagesList = languagesList + element + ', ';
      });

      return `<div class="country-info__header"><img src='${svgLink}' alt="country flag"  height='50' width='50' class="country-info__flag" "/> <p class="country-info__name" >${name}</p></div>
       <ul class="country-info__details-list">
          <li class="detail-list__elem"><span class="detail-list__name" >Capital: </span> <span class="detail-list__value" >${elem.capital}</span></li>
          <li class="detail-list__elem"><span class="detail-list__name">Population: </span> <span class="detail-list__value">${elem.population}</span></li>
          <li class="detail-list__elem"><span class="detail-list__name">Languages: </span> <span class="detail-list__value">${languagesList}</span></li>
       </ul>`;
    })
    .join('');
  countryInfo.insertAdjacentHTML('afterbegin', element);
};
