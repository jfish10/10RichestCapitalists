const draggableList = document.getElementById('draggable-list')
const checkBtn = document.getElementById('check');

const apiLimit = "10";


//Using Forbes 400 API: https://github.com/jesseokeya/Forbes400
const forbesEndpoint = 'https://forbes400.onrender.com/api/forbes400?limit=' + apiLimit;

const fetchCapitalists = fetch(forbesEndpoint).then(r => r.json()).then(data => {
  // console.log('in async');
  // console.log(data[0].personName);
  // console.log(data[0].countryOfCitizenship);
  // console.log(data[0].finalWorth);
  return data;
});

let richCapsFromForbesAPICorrect = [];
let richCapsInitial = []


window.onload = async () => {
  let richCapitalists = await fetchCapitalists;
  for (let i = 0; i < richCapitalists.length; i++) {
    richCapsFromForbesAPICorrect.push(richCapitalists[i].personName);
    richCapsInitial.push(richCapitalists[i].personName);
  }

  console.log(richCapsInitial);
  createList(richCapsFromForbesAPICorrect);
};

const listItems = [];

let dragStartIndex;

// const richestPeople = [
//   'Jeff Bezos',
//   'Bill Gates',
//   'Warren Buffett',
//   'Bernard Arnault',
//   'Carlos Slim Helu',
//   'Amancio Ortega',
//   'Larry Elison',
//   'Mark Zuckerberg',
//   'Michael Bloomberg',
//   'Larry Page'
// ];


function createList() {
  [...richCapsInitial]
    .map(a => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value)
    .forEach((person, index) => {
      const listItem = document.createElement('li');

      //listItem.classList.add('over');
      listItem.setAttribute('data-index', index);


      listItem.innerHTML = `
    <span class="number">${index + 1}</span>
    <div class="draggable" draggable="true">
    <p class="person-name">${person}</p>
    <i class="fas fa-grip-lines"></i>
    </div>
    `;
      listItems.push(listItem);


      draggableList.appendChild(listItem);
    });

  addEventListeners();
}

function addEventListeners() {
  console.log('Event: ', 'dragstart')
  const draggables = document.querySelectorAll('.draggable');
  const dragListItems = document.querySelectorAll('.draggable-list li');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
  })

  dragListItems.forEach(item => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  })

  checkBtn.addEventListener('click', checkOrder);
}

function dragStart() {
  console.log('Event: ', 'dragstart')
  dragStartIndex = +this.closest('li').getAttribute('data-index');
  console.log(dragStartIndex);
}

function dragEnter() {
  console.log('Event: ', 'dragenter')
  this.classList.add('over');
}

function dragLeave() {
  console.log('Event: ', 'dragleave')
  this.classList.remove('over');
}

function dragOver(e) {
  console.log('Event: ', 'dragover')
  e.preventDefault();
}

function dragDrop() {
  console.log('Event: ', 'drop')
  const dragEndIndex = +this.getAttribute('data-index');
  swapItems(dragStartIndex, dragEndIndex);
  this.classList.remove('over');
}

//swap list items that are drag and drop
function swapItems(fromIndex, toIndex) {
  const itemOne = listItems[fromIndex].querySelector('.draggable');
  const itemTwo = listItems[toIndex].querySelector('.draggable');

  listItems[fromIndex].appendChild(itemTwo);
  listItems[toIndex].appendChild(itemOne);
}

//check the order of list items
function checkOrder() {
  listItems.forEach((listItem, index) => {
    const personName = listItem.querySelector('.draggable').innerText.trim();
    if (personName !== richCapsFromForbesAPICorrect[index]) {
      listItem.classList.add('wrong');
    } else {
      listItem.classList.remove('wrong');
      listItem.classList.add('right');
    }
  })
}

