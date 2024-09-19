import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
    quill = new Quill('#editor', {
        theme: 'snow'
    });

    const newPostBtn = document.getElementById('newPostBtn');
    const newPostForm = document.getElementById('newPostForm');
    const postForm = document.getElementById('postForm');

    newPostBtn.addEventListener('click', () => {
        newPostForm.style.display = newPostForm.style.display === 'none' ? 'block' : 'none';
    });

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('postTitle').value;
        const author = document.getElementById('postAuthor').value;
        const body = quill.root.innerHTML;

        try {
            await backend.addPost(title, body, author);
            postForm.reset();
            quill.setContents([]);
            newPostForm.style.display = 'none';
            await fetchAndDisplayPosts();
        } catch (error) {
            console.error('Error adding post:', error);
        }
    });

    await fetchAndDisplayPosts();
});

async function fetchAndDisplayPosts() {
    try {
        const posts = await backend.getPosts();
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const article = document.createElement('article');
            article.innerHTML = `
                <h2>${post.title}</h2>
                <div class="meta">By ${post.author} on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</div>
                <div class="content">${post.body}</div>
            `;
            postsContainer.appendChild(article);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}
