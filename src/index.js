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
