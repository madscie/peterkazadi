import { sanityConfig } from './config.js';
import './background.js'; // Start the 3D engine
import { sanityConfig } from './config.js';



const { projectId, dataset, apiVersion } = sanityConfig;
const query = encodeURIComponent('*[_type == "portfolioSection"]{title, items}');
const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

async function init() {
    try {
        const response = await fetch(url);
        const { result } = await response.json();
        
        // We look for specific containers in your HTML
        const projectList = document.getElementById('project-list');
        const experienceList = document.getElementById('experienceList');
        const educationList = document.getElementById('educationList');

        result.forEach(section => {
            const content = section.items.map(item => `
                <div class="card">
                    <h4>${item.itemName}</h4>
                    <p>${item.description}</p>
                    ${item.date ? `<small>${item.date}</small>` : ''}
                </div>
            `).join('');

            // Dynamically put data in the right section based on Sanity Title
            if (section.title.toLowerCase() === 'projects') projectList.innerHTML = content;
            if (section.title.toLowerCase() === 'experience') experienceList.innerHTML = content;
            if (section.title.toLowerCase() === 'education') educationList.innerHTML = content;
        });

        // Add this to your init() function after fetching data:
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Dark Mode Logic
        const themeBtn = document.getElementById('themeToggle');
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
        });


        // 3D SCROLL LOGIC 
        
        window.addEventListener('scroll', () => {
    const avatar = document.querySelector('.floating-avatar-wrapper');
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

    // Movement math
    // Move from 10% left to 70% left based on scroll
    const moveX = 10 + (scrollPercent * 60); 
    // Gentle bobbing up and down
    const moveY = Math.sin(window.scrollY * 0.005) * 20;
    // Rotation based on scroll
    const rotate = scrollPercent * 360;

    if (window.innerWidth > 768) {
        avatar.style.left = `${moveX}%`;
        avatar.style.transform = `translateY(calc(-50% + ${moveY}px)) rotate(${rotate * 0.1}deg)`;
    }
        });
    // window.addEventListener('scroll', () => {
    // const avatar = document.querySelector('.floating-avatar-wrapper');
    // const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

    // // 1. Horizontal movement: from left to right
    // // -20 is starting position, 140 is the total distance to travel
    // const moveX = -20 + (scrollPercent * 140); 

    // // 2. Subtle vertical wave (the "floating" feel)
    // const moveY = Math.sin(window.scrollY * 0.002) * 50;

    // // 3. Scale change: make it get slightly bigger as you scroll
    // const scale = 1 + (scrollPercent * 0.3);

    // // Apply the transformation
    // // We use translate3d for better performance (GPU acceleration)
    // avatar.style.left = `${moveX}%`;
    // avatar.style.transform = `translate3d(-50%, calc(-50% + ${moveY}px), 0) scale(${scale})`;
    // });

    //function to fetch skills
    async function fetchSkills() {
    const query = encodeURIComponent('*[_type == "skill"] | order(level desc)');
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;
    
    const response = await fetch(url);
    const { result } = await response.json();
    
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = result.map(s => `
        <li class="chip">
            <strong>${s.name}</strong>
            <span class="skill-level">${s.level}</span>
        </li>
        `).join('');
    }

    // Call it inside your init() function
    fetchSkills();

        // Set current year in footer
        document.getElementById('year').textContent = new Date().getFullYear();
    } catch (err) {
        console.error("Sanity Fetch Error:", err);
    }
}

init();