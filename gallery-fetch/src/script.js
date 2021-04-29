'use strict';

const image = document.querySelector('.large-image');
const gallery = document.querySelector('.gallery-wrapper');
const button = document.querySelector('.comment-form-send');
const modalWimdow = document.querySelector('.item-focus');
const modalWimdowWrapper = document.querySelector('.item-focus-wrapper');
const closeModalButton = document.querySelector('.close-button');
const commentsBlock = document.querySelector('.item-comments');
const foucsWrapper = document.querySelector('.item-focus-wrapper');
let userName = document.querySelector('.user-name');
let comment = document.querySelector('.user-text');
modalWimdow.style.display = 'none';

button.addEventListener('click', () => {
    createComment();
});

async function sendRequest(id = 0) {
    let url = `https://boiling-refuge-66454.herokuapp.com/images`;
    if (id) {
        url = `${url}/${id}`;
    }

    return await fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (id) {
                openItemWindow(data);
            } else {
                data.map(picture => createBlock(picture));
            }

            return data;
        });

}

async function init() {
    // await fetch('https://boiling-refuge-66454.herokuapp.com/images')
    //     .then((response) => {
    //         return response.json();
    //     })
    //     .then((data) => {
    //         data.map(picture => createBlock(picture));
    //     }); 

    await sendRequest();
    setListeners();
}

// function getItemById(id) {
//     fetch(`https://boiling-refuge-66454.herokuapp.com/images/${id}`)
//         .then((response) => {
//             return response.json();
//         })
//         .then((data) => {
//             openItemWindow(data);
//             return data;
//         });
// }

function setListeners() {
    const images = document.querySelectorAll('.gallery-img');

    images.forEach(image => {
        image.addEventListener('click', (event) => {
            sendRequest(event.target.id);
            // getItemById(event.target.id)
        })
    })
}

init();


function createBlock(element) {
    const block = `
    <div class='gallery-item'>
    <img src="${element.url}"  id=${element.id} alt="gallery-item" class="gallery-img" />
    </div>`;
    gallery.insertAdjacentHTML('afterbegin', block);
}



function openItemWindow(element) {
    image.src = element.url;
    image.id = element.id;
    modalWimdow.style.display = 'grid';

    modalWimdowWrapper.style.display = 'block';

    loadComments(element.comments);
}


function loadComments(array) {
    if (commentsBlock) {
        commentsBlock.innerHTML = '';
    }

    if (array.length) {
        array.map(item => {
            let comment = `
            <div>
            <span class="comment-date">${decodeDate(item.date)}</span><br/>
            <p class="comment-text">${item.text}</p>
            </div>`;
            commentsBlock.insertAdjacentHTML('beforeend', comment);
        })
    } else {
        commentsBlock.innerHTML = 'No comments yet';
    }
}

async function createComment() {
    let image = document.querySelector('.large-image');

    if (userName.value && comment.value) {

        let objComment = {
            id: image.id,
            date: parseInt(new Date().getTime() / 1000).toFixed(0),
            name: userName.value,
            comment: comment.value,
            commentId: Date.now()
        };

        let response = await fetch(`https://boiling-refuge-66454.herokuapp.com/images/${image.id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(objComment)
        });

        userName.value = '';
        comment.value = '';
        userName.classList.remove('error');
        comment.classList.remove('error');

        response.status === 204 ? button.style.backgroundColor = 'green' : button.style.backgroundColor = 'red';
    } else {
        button.style.backgroundColor = 'red';
        comment.value ? comment.classList.remove('error') : comment.classList.add('error');
        userName.value ? userName.classList.remove('error') : userName.classList.add('error');
    }

    setTimeout(() => {
        button.style.backgroundColor = '#4997D0';
    }, 1000)

}


closeModalButton.addEventListener('click', () => {
    modalWimdowWrapper.style.display = 'none';
    modalWimdow.style.display = 'none';
    commentsBlock.innerHTML = '';
    image.src = '';
    userName.classList.remove('error');
    comment.classList.remove('error');
});


function decodeDate(UNIX_timestamp) {
    let timestamp = new Date(UNIX_timestamp)
    let months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    let year = timestamp.getFullYear()
    let month = months[timestamp.getMonth()]
    let date = timestamp.getDate()

    date < 10 ? date = `0${date}` : date = date;
    month < 10 ? month = `0${month}` : month = month;
    let time = ` ${ date}.${ month }.${ year }`;
    return time
}