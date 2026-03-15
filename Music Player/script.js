let audio = new Audio();
let tracks = [];
let index = 0;
let playing = false;
let likedTracks = [];

let playBtn = document.getElementById("playBtn");
let seek = document.getElementById("seek");
let volume = document.getElementById("volume");
let trackArt = document.querySelector(".track-art");
let likeBtn = document.getElementById("likeBtn");
let trackSelect = document.getElementById("trackSelect");

let colorThief = new ColorThief();

function updateTrackSelect(){
trackSelect.innerHTML=`<option value="">Select Track</option>`;

tracks.forEach((t,i)=>{
const opt=document.createElement("option");
opt.value=i;
opt.textContent=t.name;
trackSelect.appendChild(opt);
});
}

document.getElementById("fileInput").addEventListener("change",function(e){

Array.from(e.target.files).forEach(file=>{
tracks.push({
name:file.name,
src:URL.createObjectURL(file),
art:null
});
});

renderPlaylist();
updateTrackSelect();

});

document.getElementById("imageInput").addEventListener("change",function(e){

const selectedIndex=parseInt(trackSelect.value);

if(isNaN(selectedIndex)){
alert("Select a track first");
return;
}

const file=e.target.files[0];

if(file){
tracks[selectedIndex].art=URL.createObjectURL(file);

if(selectedIndex===index)
loadTrack(index);

renderPlaylist();
}

});

function renderPlaylist(){

let list=document.getElementById("trackList");
list.innerHTML="";

tracks.forEach((t,i)=>{

let li=document.createElement("li");

li.innerHTML=`${t.name} <span class="mood-label">${likedTracks.includes(i) ? '❤️' : ''}</span>`;

li.onclick=()=>loadTrack(i);

list.appendChild(li);

});

}

function loadTrack(i){

index=i;
audio.src=tracks[index].src;

document.querySelector(".track-name").innerText=tracks[index].name;
document.querySelector(".track-artist").innerText="Local Song";

updateLikeIcon();

trackArt.innerHTML="";

if(tracks[index].art){

let img=document.createElement("img");
img.src=tracks[index].art;

img.onload=function(){
setTimeout(()=>updateBackgroundColor(img),50);
}

trackArt.appendChild(img);

}else{

trackArt.innerHTML='<i class="fas fa-compact-disc"></i>';
document.body.style.background="#ffd6e7";

}

audio.play();
playing=true;

updateUI();

}

function updateBackgroundColor(img){

let color=colorThief.getColor(img);

document.body.style.background=`rgb(${color[0]},${color[1]},${color[2]})`;

}

function playPause(){

if(tracks.length==0) return;

if(!playing){

audio.play();
playing=true;

}else{

audio.pause();
playing=false;

}

updateUI();

}

function prevTrack(){

if(tracks.length==0) return;

index=(index-1+tracks.length)%tracks.length;

loadTrack(index);

}

function nextTrack(){

if(tracks.length==0) return;

index=(index+1)%tracks.length;

loadTrack(index);

}

function toggleLike(){

if(likedTracks.includes(index)){

likedTracks=likedTracks.filter(i=>i!==index);

}else{

likedTracks.push(index);

}

updateLikeIcon();
renderPlaylist();

}

function updateLikeIcon(){

if(likedTracks.includes(index)){

likeBtn.classList.replace("fa-regular","fa-solid");

}else{

likeBtn.classList.replace("fa-solid","fa-regular");

}

}

function updateUI(){

if(playing){

playBtn.classList.replace("fa-circle-play","fa-circle-pause");
document.body.classList.add("playing");

}else{

playBtn.classList.replace("fa-circle-pause","fa-circle-play");
document.body.classList.remove("playing");

}

}

audio.ontimeupdate=function(){

if(audio.duration){

seek.value=(audio.currentTime/audio.duration)*100;

document.getElementById("current").innerText=format(audio.currentTime);
document.getElementById("duration").innerText=format(audio.duration);

}

}

seek.oninput=function(){

if(audio.duration)
audio.currentTime=(seek.value/100)*audio.duration;

}

volume.oninput=function(){

audio.volume=volume.value/100;

}

function format(t){

let m=Math.floor(t/60)||0;
let s=Math.floor(t%60)||0;

return m+":"+(s<10?"0"+s:s);

}

function togglePlaylist(){

document.getElementById("playlist").classList.toggle("active");

}

audio.onended=nextTrack;
