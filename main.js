const date = new Date();
const select = document.getElementById('year');
const resultBtn = document.getElementById('resultBtn');
const tableContainer = document.getElementById('tableContainer');
const filmTable = document.querySelector('.table');
const tBody = document.createElement('tbody');
const pagination = document.createElement('ul');
let prevPage = makePage('Previous', 'disabled');
let nextPage = makePage('Next');
let option, i;
let idx = 1;
pagination.classList = 'pagination d-flex flex-wrap justify-content-center';

function makeYSelect() {
  for (i = 1910; i <= date.getFullYear(); i++) {
    option = document.createElement('option');
    option.value = i;
    option.innerHTML = i;
    if (i === 1997) 
      option.setAttribute('selected', 'selected');
    select.appendChild(option);
  }
}

function makePage(text, cls='') {
  const page = document.createElement('li');
  const link = document.createElement('a');
  page.className = 'page-item ';
  page.classList += cls;
  link.classList = 'page-link';
  link.href = '#';
  link.innerHTML = text;
  page.appendChild(link);
  return page;
}

function makeItemTD(text) {
  const filmItem = document.createElement('td');
  const filmLink = document.createElement('a');
  filmItem.classList = 'd-flex justify-content-between align-items-center font-weight-bold';
  filmItem.innerHTML = text;
  filmLink.href = `https://movie.naver.com/movie/search/result.nhn?query=${text}&section=all&ie=utf8`;
  filmLink.target = '_blank';
  filmLink.innerHTML = '자세히';
  filmItem.appendChild(filmLink);
  return filmItem;
}

function makeDirectorTD(text) {
  const filmDirector = document.createElement('td');
  filmDirector.classList = 'align-middle font-weight-light';
  filmDirector.innerHTML = 
    text === undefined ? '정보 없음' : text.peopleNm;
  return filmDirector;
}

function fetchData() {
  let year = select.value;
  let filmItem, filmDirector;
  tBody.innerHTML = '';
  pagination.innerHTML = '';
  fetch(`http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${myKey}&curPage=${idx}&itemPerPage=10&openStartDt=${year}&openEndDt=${year}`)
    .then((res) => res.json())
    .then((data) => {
      for (i = 0; i < 10; i ++) {
        console.log(`${data.movieListResult}`);
        console.log(`${i}번 제목 : ${data.movieListResult.movieList[i].movieNm}`);
        filmRow = document.createElement('tr');
        filmItem = makeItemTD(data.movieListResult.movieList[i].movieNm);
        filmDirector = makeDirectorTD(data.movieListResult.movieList[i].directors[0]);
        filmRow.appendChild(filmItem);
        filmRow.appendChild(filmDirector);
        tBody.appendChild(filmRow);
      }
      prevPage = (idx === 1) ? 
        makePage('Previous', 'disabled ') : makePage('Previous');
      nextPage = (idx === 10) ?
        makePage('Next', 'disabled ') : makePage('Next');
      pagination.appendChild(prevPage);
      for (i = 1; i <= 10; i++) {
        const pageItem = (i === idx) ? 
        makePage(i, 'active ') : makePage(i);
        pagination.appendChild(pageItem);
      }
      pagination.appendChild(nextPage);
      filmTable.appendChild(tBody);
      tableContainer.appendChild(pagination);
    });
}

resultBtn.addEventListener('click', function() {
  fetchData();
});

pagination.addEventListener('click', function(e) {
  if (e.target.innerHTML === 'Previous') {
    idx--;
    fetchData();
  } else if (e.target.innerHTML === 'Next') {
    idx++;
    fetchData();
  } else {
    idx = Number(e.target.innerHTML);
    fetchData();
  }
});

makeYSelect();