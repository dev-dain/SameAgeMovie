const select = document.getElementById('year');
const resultBtn = document.getElementById('resultBtn');
const filmList = document.querySelector('.list-group');
const date = new Date();

let option;
for (let i = 1910; i <= date.getFullYear(); i++) {
  option = document.createElement('option');
  option.value = i;
  option.innerHTML = i;
  if (i === 1997) 
    option.setAttribute('selected', 'selected');
  select.appendChild(option);
}

resultBtn.addEventListener('click', function() {
  let year = select.value;
  let filmItem, filmDirector, filmLink;
  filmList.innerHTML ='';
  fetch(`http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${myKey}&itemPerPage=50&openStartDt=${year}&openEndDt=${year}`)
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < 50; i++) {
        filmItem = document.createElement('li');
        filmDirector = document.createElement('span');
        filmLink = document.createElement('a');
        filmItem.classList += 'list-group-item d-flex justify-content-between align-items-center font-weight-bold';
        filmItem.innerHTML = data.movieListResult.movieList[i].movieNm;
        filmDirector.className = 'font-weight-light';
        filmDirector.innerHTML = '감독 : ' + data.movieListResult.movieList[i].directors[0].peopleNm;
        filmLink.href = `https://movie.naver.com/movie/search/result.nhn?query=${data.movieListResult.movieList[i].movieNm}&section=all&ie=utf8`;
        filmLink.target = '_blank';
        filmLink.innerHTML = '상세보기';
        filmItem.appendChild(filmDirector);
        filmItem.appendChild(filmLink);
        filmList.appendChild(filmItem);
      }
    });
});