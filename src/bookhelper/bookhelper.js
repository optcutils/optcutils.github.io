const fortnights = require('../../bookhelper/assets/json/fortnights.json').Fortnight;
const charObject = require('../../bookhelper/assets/json/characters.json');
const $ = require('jquery');
const selectize = require('selectize');
const unique = (data) => Array.from(new Set(data));
const fortnightsTable = $('#fortnightsTable');
const characterNames = $('#characterNames');
const characterBox = $('#characterBox');
let selectedCharacters;

if (localStorage.getItem('characters')) {
    selectedCharacters = new Set(JSON.parse(localStorage.getItem('characters')));
} else {
    selectedCharacters = new Set();
}

function clearTable(fortnightsTable) {
    fortnightsTable.empty();
}

let select = characterNames.selectize({
    closeAfterSelect: true,
    placeholder: 'Select your character',
    allowEmptyOption: true,
    hideSelected: true,
    onFocus: clearSelect,
    options: charObject,
    valueField: 'value',
    labelField: 'name',
    searchField: 'name',
    sortField: 'value',
    render: {
        option: function (item, escape) {
            return '<div><span style="display: inline-block;background-size: 30px 30px;width: 30px; height: 30px; background-image: url(\'https://onepiece-treasurecruise.com/wp-content/uploads/f' + escape(pad(item.value, 4)) + '.png\');" />&nbsp;' + escape(item.name) + '</div>'
        }
    }
});

function clearSelect() {
    select[0].selectize.clear();
}

characterNames.on('change', (evt) => {
    if (evt.target.value != 0) {
        selectedCharacters.add(pad(evt.target.value, 4));
    }
    createCharacterBox();
    saveData();
});

characterBox.on('click', 'a', evt => {
    const id = evt.currentTarget.dataset.charId;
    selectedCharacters.delete(id);
    createCharacterBox();
});

function createCharacterBox() {
    saveData();
    characterBox.empty();
    characterBox.append(Array.from(selectedCharacters).map(c => `<div class="charBoxImage"><img src="https://onepiece-treasurecruise.com/wp-content/uploads/f${c}.png" class="characterImage" /><a class="boxclose" id="boxclose" data-char-id="${c}"></a></div>`));
    loadTable(fortnights, Array.from(selectedCharacters));
}

function loadTable(fortnights, characterList = []) {
    const filteredTable = characterList.length
        ? fortnights
            .filter((e) => e.drops
                .some((f) => characterList.indexOf(f) > -1))
        : fortnights;
    const html = filteredTable
        .map((element) => `
            <tr>
                <td class="fortnightTitle"><img src="https://onepiece-treasurecruise.com/wp-content/uploads/f${element.thumb}.png" style="width: 50px; height: 50px; margin-right: 10px;">${element.name}</td>
                <td class="fortnightCharacters">${filterDrops(unique(element.drops), characterList)}</td>
            </tr>`);
    clearTable(fortnightsTable);
    fortnightsTable.append(html.join(''));
}

function filterDrops(dropList, characterList) {
    const imgList = dropList
        .filter(e => characterList.indexOf(e) > -1)
        .map(f => `<img src="https://onepiece-treasurecruise.com/wp-content/uploads/f${f}.png" class="characterImage" />`)
        .join('');
    return imgList.length ? imgList : 'No characters selected';
}

function saveData() {
    localStorage.setItem('characters', JSON.stringify(Array.from(selectedCharacters)));
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

createCharacterBox();