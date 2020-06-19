const date = new Date();
const select = document.getElementById('year');
const resultBtn = document.getElementById('resultBtn');
const tableContainer = document.getElementById('tableContainer');
const filmTable = document.querySelector('.table');
const tBody = document.createElement('tbody');
const pagination = document.createElement('ul');
let option, i;
const LIST_ITEM_CNT = 10;  //결과 table에 들어갈 tr 개수
const PAGE_CNT = 5;  //pagination 한 줄에 들어갈 페이지의 개수
let totCnt = 0; //전체 영화 개수
let curPageIdx = 1;  //현재 페이지 인덱스
let lastPageIdx = 0;  //totCnt에 의해 정해지는 가장 마지막 페이지
let curListIdx = 0; //현재 5 단위 페이지 인덱스
let lastListIdx = 0;  //lastPageIdx에 의해 정해지는 마지막 리스트 값.
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

function addPagination() {
  let prevPage = (curPageIdx === 1) ?
    makePage('Previous', 'disabled ') : makePage('Previous');
  let nextPage = (curPageIdx === lastPageIdx) ?
    makePage('Next', 'disabled ') : makePage('Next');
  let prevList = (curListIdx === 0) ?
    makePage('&lsaquo;', 'disabled') : makePage('&lsaquo;');
  let nextList = (curListIdx === lastListIdx) ?
    makePage('&rsaquo;', 'disabled') : makePage('&rsaquo;');
  let frontList = (curListIdx === 0) ?
    makePage('&laquo;', 'disabled') : makePage('&laquo;');
  let backList = (curListIdx === lastListIdx) ?
    makePage('&raquo;', 'disabled') : makePage('&raquo;');
  
  pagination.appendChild(frontList);
  pagination.appendChild(prevList);
  pagination.appendChild(prevPage);
  let loopPageCnt = (curListIdx === lastListIdx) ?
    lastPageIdx : PAGE_CNT * (curListIdx + 1);
  for (i = (curListIdx * PAGE_CNT) + 1; i <= loopPageCnt; i++) {
    const pageItem = (i === curPageIdx) ?
      makePage(i, 'active ') : makePage(i);
    pagination.appendChild(pageItem);
  }
  pagination.appendChild(nextPage);
  pagination.appendChild(nextList);
  pagination.appendChild(backList);
}

function fetchData() {
  let year = select.value;
  let filmItem, filmDirector;
  tBody.innerHTML = '';
  pagination.innerHTML = '';
  fetch(`http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${myKey}&curPage=${curPageIdx}&itemPerPage=${LIST_ITEM_CNT}&openStartDt=${year}&openEndDt=${year}`)
    .then((res) => res.json())
    .then((data) => {
      totCnt = data.movieListResult.totCnt;
      lastPageIdx = Math.ceil(totCnt / 10);
      lastListIdx = Math.floor(lastPageIdx / PAGE_CNT);
      let loopInfoCnt = (curPageIdx === lastPageIdx) ? (totCnt % LIST_ITEM_CNT) : LIST_ITEM_CNT;
      for (i = 0; i < loopInfoCnt; i++) {
        filmRow = document.createElement('tr');
        filmItem = makeItemTD(data.movieListResult.movieList[i].movieNm);
        filmDirector = makeDirectorTD(data.movieListResult.movieList[i].directors[0]);
        filmRow.appendChild(filmItem);
        filmRow.appendChild(filmDirector);
        tBody.appendChild(filmRow);
      }
      addPagination();
      filmTable.appendChild(tBody);
      tableContainer.appendChild(pagination);
    });
}

resultBtn.addEventListener('click', function() {
  curPageIdx = 1;
  curListIdx = 0;
  fetchData();
});

pagination.addEventListener('click', function(e) {
  if (e.target.innerHTML === 'Previous') {
    if (curPageIdx === (curListIdx) * PAGE_CNT + 1)
      curListIdx--;
    if (curPageIdx === 1) {
      curPageIdx = 1;
      curListIdx = 0;
    } else {
      curPageIdx--;
    }
    fetchData();
  } else if (e.target.innerHTML === 'Next') {
    if (curPageIdx === (curListIdx + 1) * PAGE_CNT)
      curListIdx++;
    curPageIdx = (curPageIdx === lastPageIdx) ? lastPageIdx : curPageIdx + 1;
    fetchData();
  } else if (e.target.innerHTML === '‹') {
    (curListIdx === 0) ? curListIdx = 0 : curListIdx--;
    curPageIdx = (curListIdx * PAGE_CNT) + 1;
    fetchData();
  } else if (e.target.innerHTML === '›') {
    (curListIdx === lastListIdx) ? curListIdx = lastListIdx : curListIdx++;
    curPageIdx = (curListIdx * PAGE_CNT) + 1;
    fetchData();
  } else if (e.target.innerHTML === '«') {
    curListIdx = 0;
    curPageIdx = 1;
    fetchData();
  } else if (e.target.innerHTML === '»') {
    curListIdx = lastListIdx;
    curPageIdx = lastPageIdx;
    fetchData();
  } else {
    if (String(e.target.classList).indexOf('disabled') !== -1) {
      e.target.childNodes[0].click();
    } else {
      curPageIdx = Number(e.target.innerHTML);
      fetchData();
    }
  }
  console.log(curPageIdx);
  console.log(curListIdx);
});

makeYSelect();