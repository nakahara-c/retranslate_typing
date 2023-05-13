/*** 
 * Copyright (c) 2021 Whitefox
 * This code is part of RomanTypeParser and is released under the MIT License.
 * https://github.com/WhiteFox-Lugh/RomanTypeParser/blob/main/LICENSE
***/


'use strict';

// This function is based on code from RomanTypeParser by Whitefox (MIT License)
import { parser } from './parser.js';

import { createWords } from './words.js';
import { wordListJapanese } from './words.js';

const input = document.getElementById('input');
let typeText = '';
let order = [];
let shuffledOrder = [];
const wordsCount = 100;
let parsedArray = [];

setWord();

window.addEventListener('keydown', judgeEscape, true);

function judgeEscape(e) {
    if (e.key === 'Escape') {
        if (timerArray.length !== 0) addTypeCount();
        contentList[choosingLevel].click();
    }

}

function firstKeyPressed() {
    timer.textContent = "30.0";
    count.textContent = "0";
    timerArray.push(setInterval(startTimer, 100));
}

function startTimer() {
    let nowTime = timer.textContent - 0.1;
    nowTime = Number.parseFloat(nowTime).toFixed(1);
    if (nowTime <= 0) {
        typeFinish(false);
    }
    timer.textContent = nowTime;
}

function stopInterval() {
    if (timerArray.length > 0) {
        clearInterval(timerArray.shift());
    }
}

function setWord() {
    let shuffledWordList;
    shuffledWordList = shuffleArray(wordListJapanese);
    shuffledWordList = shuffledWordList.slice(0, wordsCount);
    (async () => parsedArray = parser(shuffledWordList.join(' ')))();
    console.log(parsedArray);
    typeText = shuffledWordList.join('　');

    
    input.value = typeText.slice(0, wordsCount);

    order = [];
    shuffledOrder = [];
    for (let i = 0; i < wordsCount; i++) order.push(i);
    shuffledOrder = shuffleArray(order);


    window.addEventListener('keydown', judgeKeys, false);

    return;

}



function judgeKeys(e) {
    e.preventDefault();

    let typedKey = e.key;

    //judgeAutomaton受け取ってそれに応じて判定していく
    /*
    extraWord.judgeAutomaton -> ["ta"], ["pu"],...
    extraWord.parsedSentence -> ["た"], ["ぷ"],...
    */



    let currentHiragana = parsedArray.parsedSentence[0];
    let currentRoman = parsedArray.judgeAutomaton[0];

    let isOK = false;
    let isLast = false;
    for (let i = 0; i < currentRoman.length; i++) {
        if (typedKey === currentRoman[i][0]) {
            isOK = true;
            if (currentRoman[i].length === 1) {
                isLast = true;
            } else {
                currentRoman[i] = currentRoman[i].slice(1);
            }
        }
    }

    if (isOK) {

        if (timer.textContent === '') {
            firstKeyPressed();
        }

        if (isLast) {
            parsedArray.parsedSentence.shift();
            parsedArray.judgeAutomaton.shift();

            parsedArray = parsedArray.slice(1);

            input.value = parsedArray;

        }

        correctType();

    }

}

function correctType(key) {
    typeText = typeText.slice(1);
    input.value = typeText;
}

function typeFinish(isCompleted) {
    stopInterval();

    window.removeEventListener('keydown', judgeKeys, false);
    input.value = 'Press Escape...';

    makeTweet();

}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

//objectを渡す
function makeTweet (info) {

    const tweetButton = document.getElementById('tweet');
    
    //objectの中身を取り出す
    const s = info.score;

    const hashTags = "ほげほげたいぴんぐ";

    const tweetText = `
    ${s}てんでほげほげたいぴんぐしました！
    `;

    const url = 'http://hoge.com/index.html';
    const tweetURL = `https://twitter.com/intent/tweet?ref_src=twsrc&text=${tweetText}&hashtags=${hashTags}&url=${url}`;
    
    tweetButton.href = tweetURL;

}