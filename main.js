/**
 * Flow handler
 */
async function getCountryInfo() {
    const value = document.getElementById('search').value;
    //disable the button while we are fetching the country data
    document.getElementById('button').disabled = true;
    const countryData = await fetchCountryData(value);
   
    //show the error or HTML country data
    if (countryData) {
        //clear the HTML data
        await clearHTML();
        //populate the HTML with retrieved data
        populateCountryHTML(countryData);
    } else {
        showError();
    }
     //when countryData has been fetched and displayed we re-enable the button again
     document.querySelector('button').disabled = false;
}

/**
 * Fetches the country data
 * @param {string} country 
 * @returns {object}|void
 */
async function fetchCountryData(country) {
    let response = {};
    try {
        const url = `https://restcountries.eu/rest/v2/name/${country}`;
        response = await axios.get(url);
    } catch {
        return [];
    }

    return response.data[0];
}

/**
 * Clears all country data
 */
async function clearHTML() {
    const wrapper = document.getElementById('countryWrapper')
    wrapper.style.opacity = 0;
    document.getElementById('countryData').innerHTML = "";
    setTimeout(() => {
        wrapper.style.opacity = 1;
    }, 1000);
}

/**
 * Populate the front end with the fetched data
 * @param {object} data 
 */
function populateCountryHTML(data) {
    //get data
    const currency = generateCurrencyText(data.currencies);
    const language = generateLanguageText(data.languages);
    //get and create base nodes
    const country = document.getElementById('countryData');
    const imageWrapper = document.createElement('div');
    imageWrapper.setAttribute('id', 'imageWrapper');
    country.appendChild(imageWrapper);

    /*insert data into nodes(childs) upon the base nodes(parents) */
    //we generate the country flag
    const countryFlag = document.createElement('IMG');
    countryFlag.setAttribute('src', data.flag);
    countryFlag.setAttribute('width', '100px');
    imageWrapper.appendChild(countryFlag);

    //we generate the country name
    const countryName = document.createElement('h1')
    countryName.textContent = data.name;
    imageWrapper.appendChild(countryName);

    //we generate the country info (topografy, population)
    const countryInfo = document.createElement('p')
    countryInfo.textContent = `${data.name} is situated in ${data.subregion}. It has a population of ${data.population} people.`;
    country.appendChild(countryInfo)

    //we generate the capital name and the currencies being used
    const displayCountryInfo = document.createElement('p')
    displayCountryInfo.textContent = `The capital is ${data.capital} and ${currency}`;
    country.appendChild(displayCountryInfo);

    const countryLanguage = document.createElement('p')
    countryLanguage.textContent = language;
    country.appendChild(countryLanguage)

    //we create a link to the wikipedia
    const countryWiki = document.createElement('a')
    countryWiki.textContent = `More info about ${data.name} on Wikipedia`
    countryWiki.href = `https://en.wikipedia.org/wiki/${data.name}`
    countryWiki.target = '_blank'
    country.appendChild(countryWiki)
}


/**
 * Creates a text string based on the currency in the given object
 * 
 * @param {object} currencies 
 * @returns 
 */
function generateCurrencyText(currencies) {
    //we generate the base string
    let currencyString = 'you can pay with ';
    for (let i = 0; i < currencies.length; i++) {
        if (i > 0) {
            //if we already had the first value of the array we add 'and'
            currencyString += ' and '
        }
        //we add the currency to the string
        currencyString += `${currencies[i].name}'s`
    }
    //we finish by adding a dot to the end and return the value
    currencyString += '.';

    return currencyString;
}

/**
 * Creates a text string based on the language in the given object
 * 
 * @param {object} languages 
 * @returns 
 */
function generateLanguageText(languages) {
    let languageString = 'They speak';
    for (let i = 0; i < languages.length; i++) {
        if (languages.length > 1) {
            if (i === languages.length - 1) {
                languageString += ' and'
            } else {
                languageString += ', '
            }
        }
        languageString += ` ${languages[i].name}`;
    }
    languageString += '.';

    return languageString;
}

/**
 * Shows a default error message.
 */
function showError() {
    const errElement = document.getElementById('err')
    errElement.innerHTML = 'The given country does not exist in our data, check your input and try again!';
    errElement.style.opacity = 1;
    setTimeout(() => {
        errElement.style.opacity = 0;
    }, 3000);
}