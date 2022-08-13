//function collectgarbage() {if (global.gc) {global.gc();}}

//if (global.gc) {if (global.gc) {}else{console.log("Can't manually control garbage collector! If you don't want to have the process take up gigs of memory, close the script and run this instead: node --expose-gc index.js")}}
console.clear()
console.log("Welcome to Skynet!")
const { Confirm } = require('enquirer')
const { prompt } = require('enquirer')
const { Worker, isMainThread, workerData, BroadcastChannel} = require('worker_threads')
//console.log(require('enquirer').prompts)

const mineflayer = require('mineflayer');
const pvp = require("mineflayer-pvp").plugin
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");

const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock
var botparams = {}
//var bots = new Map()
var instancetree = new Map()
var targetlist = new Object()
var threads = []
// str.replace(/\s/g, '');

/*

var regexTeleport = /([0-9a-zA-Z_]{1,16}) has requested (?:that you|to) teleport to (you|them)\./;
var whitelist = ['CorruptedPirate'];

bot.on("messagestr", async function (message) {

  var match = regexTeleport.exec(message);
  if(!match) return;

  var username = match[1];
  var type = (match[2] == 'you') ? 'to you' : 'to them'; 
  console.log(`[!] User ${username} has requested a teleport ${type}`);
  if(!whitelist.includes(username)) return;
  bot.chat('/tpaccept')

});

*/

//function loop(count,delay,func){for (let i=0;i<count;i++){ setTimeout(function(){func()},delay*i)}}

/*function getKeyByValue(object, value) {    //// YOU SHOULD KILL YOURSELF JAVASCRIPT!!!!!
  return Object.keys(object).find(key => object[key] === value);
}*/

function mainmenu(){
let menu = {
  name: 'selection',
  message: "What would you like to do?",
  type: "Select",
  choices: ["Manage profiles","Manage instances","Crackhead shenanigans"]
}
prompt(menu)
.then(answer=>{
if(answer.selection==menu.choices[0].value){botprofilemenu()}
if(answer.selection==menu.choices[1].value){commandandconquer()}
if(answer.selection==menu.choices[2].value){console.log("lol!"); mainmenu()}
})
.catch()
};

//// These are all the menus for profile management
function botprofilemenu(){
let menu= {
    name: 'selection',
    message: "What would you like to do?",
    type: "Select",
    choices: ["Go back","Create a profile","Remove profile"] //"Select profile" - Merged into login menus
}
prompt(menu)
.then(answer=>{
if(answer.selection==menu.choices[0].value){mainmenu()}
if(answer.selection==menu.choices[1].value){createprofile(botprofilemenu)}
//if(answer.selection==menu.choices[2].value){selectprofile(botprofilemenu)}
if(answer.selection==menu.choices[2].value){removeprofile()}
})
.catch()
};

function createprofile(returnto){
let menu=[
  {
    type: "Input",
    message: "What profile name do you desire?",
    initial: "profile",
    name: "profilename"
  },
  {
    type: "Input",
    message: "What should the bot chat on login?",
    initial: "/ban @a",
    name: "loginchat"
  },
  {
    type: "Confirm",
    message: "Do you want to disable AI?",
    name: "disableai"
  }
]
prompt(menu)
.then(answer=>{
let name = answer.profilename
while (botparams[name] !== undefined) {name = name+"_clone"}
botparams[name] = answer
returnto()
})
.catch()
}

function selectprofile(returnto) {
let menu = {
  name: "selection",
  type: "Select",
  message: "Select to activate a profile.",
  choices: Object.keys(botparams)
}
function ret() {if(returnto!==undefined){returnto()}}
menu.choices.push("Cancel")
prompt(menu)
.then(answer=>{
if (answer.selection!=="Cancel") {return botparams[answer.selection]} else {return false}})
.catch()
}

function removeprofile() {
  let menu = {
    name: "selection",
    type: "MultiSelect",
    message: "Delete any profiles at your heart's content",
    choices: Object.keys(botparams)
  }
  if (Object.keys(botparams).length>0){console.log("[Remember to press SPACE to select items then press ENTER to confirm!]")} else {console.log("You don't have any profiles!"); botprofilemenu(); return}
  prompt(menu)
  .then(answer=>{answer.selection.forEach(function(x){delete botparams[x]}); botprofilemenu()})
  .catch()
}
////
function commandandconquer(){
  let menu = {
  name: "selection",
  type: "Select",
  message: "Skynet",
  choices: ["Go back","Manual login","Instance generation (offline servers)","Manage active instances","Manage targets"]
  }
  prompt(menu)
  .then(answer=>{
    if(answer.selection==menu.choices[0].value){mainmenu()}
    if(answer.selection==menu.choices[1].value){manuallogin()}
    if(answer.selection==menu.choices[2].value){generatebots()}
    if(answer.selection==menu.choices[3].value){instancemenu()}
    if(answer.selection==menu.choices[4].value){managetargets()}
  })
  .catch()
}
function manuallogin() {
if (Object.keys(targetlist).length>0){} else {console.log("You don't have any servers to log into!"); addserver(manuallogin);}
//if (currenttarget!==undefined && currenttarget!==""){} else {console.log("You have to select a server!"); selectserver(manuallogin); return}
let currenttarget2 = selectserver()
while (!currenttarget2) {}
let auth = [{
    name: "loginmethod",
    message: "Choose your authentication method",
    choices: ["mojang","microsoft"]
},
{}
]
let cracked = new Confirm({
  name: "cracked",
  message: "Are you willing to authenticate via Mojang/Microsoft?"
})
let user = {
  name: "username",
  type: "Input",
  message: "Type your desired username"
}
let profile = new Confirm({
  name: "cracked",
  message: "Are you willing to use the active profile?"
})
let authenticate = 
  {
    type: 'password',
    name: 'password',
    message: "Please input your account's password."
  }

cracked.run()
 .then(answer=>{
  let loginmethod;
  let username;
  let pw = false;
  if (answer===true){prompt(auth).then(answer=>{loginmethod=answer.loginmethod; prompt(authenticate).then(answer=>{pw=username.pw})}).catch()}
   else{
    profile.run().then(panswer=>{
    

    prompt(user).then(answerr=>{ let u="Notch"; if(answerr.username!==""){u=answerr.username} commandandconquer(); 


    generateinstance(u,currenttarget2[0],currenttarget2[1],panswer,pw)

    })}).catch()}}).catch()
    
}

function generateinstance(user,ip,port,profile,pw) {

if (instancetree.get(ip)!==undefined && instancetree.get(ip).get(port)!==undefined){
if (Array.from(instancetree.get(ip).get(port).values()).includes(user)===true){return}}

let worker = new Worker("./Worker.js", { workerData: [user,activeprofile,profile,ip,port,pw]})
instancetree.set(ip,new Map())
instancetree.get(ip).set(port,new Map())

threads.push(worker)

worker.on('message', (event) => {
if (event==="rejoin") {threads.splice(threads.indexOf(worker),1); instancetree.get(ip).get(port).delete(worker.threadId); worker.terminate(); setTimeout(generateinstance(user,ip,port,profile,pw),10000)}
if (event==="killme") {threads.splice(threads.indexOf(worker),1); instancetree.get(ip).get(port).delete(worker.threadId); worker.terminate()}
if (typeof(event)==="object" && event["creation"]!==undefined) {instancetree.get(ip).get(port).set(worker.threadId,event["creation"]); threads.forEach(w=>w.postMessage({botlist: Array.from(instancetree.get(ip).get(port).values())})) } //threads.forEach(w=>{w.postMessage({list: Object.values(bots)})})}
})
//setTimeout(function(){worker.postMessage("HELLO NIGGER!")},1000)
}

function generatebots() {
if (Object.keys(targetlist).length>0){} else {console.log("You don't have any servers to log into!"); addserver(generatebots);  return}
//if (currenttarget!==undefined && currenttarget!==""){} else {console.log("You have to select a server!"); selectserver(generatebots); return}
let currenttarget2 = selectserver()
let bulk = [{
 name: "prefix",
 type: "Input",
 message: "Type your desired bot prefix",
},
{
name: "count",
type: "Numeral",
message: "How many bots do you want to generate in bulk?",
initial: 5
},
{
name: "profile",
type: "Confirm",
message: "Do you want to use the active profile?",
initial: true
},
{
 name: "delay",
 type: "Numeral",
 message: "Set a delay in between each bot (ms)",
 initial: 4500
}
]

prompt(bulk)
.then(answer=>{
  for(let i = 0; i<answer.count;i++){
  setTimeout(function(){generateinstance(answer.prefix+(i+1),currenttarget2[0],currenttarget2[1],answer.profile)},answer.delay*i)
  }
  
  commandandconquer();
})
.catch()


}
function instancemenu() {
  if (Object.keys(targetlist).length>0){} else {console.log("The server list is empty!"); commandandconquer(); return}
  if (currenttarget!==undefined && currenttarget!==""){} else {console.log("You have to select a server!"); selectserver(); return}
  if (Object.keys(bots).length>0){} else {console.log("There are no bots logged in!"); commandandconquer(); return}
let menu = {
    type: "Select",
    name: "selection",
    message: "What do you wish to control?",
    choices: ["Go back","Manual selection", "The entire swarm at once"]
}
  prompt(menu)
  .then(answer=>{
    if(answer.selection==menu.choices[0].value){commandandconquer()}
    if(answer.selection==menu.choices[1].value){controlinstance()}
    if(answer.selection==menu.choices[2].value){controlswarm()}
  
})
}

function controlinstance() {
console.log("[Remember to press SPACE to select items then press ENTER to confirm!]")
let t = new Array()
Array.from(bots.values()).forEach(k=>{t.push(k)})
let menu = {
type: "MultiSelect",
message: "Select any instance you desire to control",
name: "choices",
choices: t
}
prompt(menu)
.then(answer=>{if (answer.choices.length>0){literally1987(answer.choices)}else{instancemenu()}})
.catch()

}

function controlswarm() {
literally1987(Array.from(bots.values()))
}

function literally1987(users){
let menu = {
type: "Select",
message: "What's your next move?",
name: "selection",
choices: ["Go back","Remove instance","Send message to chat","Go to","Follow player","Halt movement"]
}
let chatinput = {
  type: "Input",
  message: "Type your desired chat message",
  name: "txt",
  initial: "have sex with children and kill them"
}
let inputcoords = [
  {
  type: "Numeral",
  message: "Type the X coordinate",
  name: "X",
  initial: 0
  },
  {
  type: "Numeral",
  message: "Type the Y coordinate",
  name: "Y",
  initial: 0
  },
  {
  type: "Numeral",
  message: "Type the Z coordinate",
  name: "Z",
  initial: 0
  }
]
let followplayer = {
  type: "Input",
  message: "Who do you want to follow?",
  name: "username",
  initial: "Notch"
}
let Confirm = {
type: "Confirm",
message: "Are you sure?",
initial: false,
name: "b"
}
function revert() {console.log("You don't have any loaded profiles!");literally1987(users)}
prompt(menu)
.then(answer=>{
  if(answer.selection==menu.choices[0].value){ instancemenu();    }
  if(answer.selection==menu.choices[1].value){ 
  prompt(Confirm).then(answer=>{ 
  if(answer.b===true){
  bots.forEach(k=>{
  if(users.includes(k.username)){
  k.end()}})} commandandconquer()}).catch()}


  if(answer.selection==menu.choices[2].value){ prompt(chatinput).then(chat=>{bots.forEach(k=>{if(users.includes(k.username)){k.chat(chat.txt)}});literally1987(users)}).catch()} 


  if(answer.selection==menu.choices[3].value){ if (activeprofile!==undefined && activeprofile.disableai===false){ prompt(inputcoords).then(answer=>{ bots.forEach(k=>{if(users.includes(k.username)){k.pathfinder.setMovements(new Movements(k,require('minecraft-data')(k.version)));k.pathfinder.setGoal(new GoalBlock(answer.X,answer.Y,answer.Z))}});literally1987(users)}).catch()} else {revert()}}

// bots.forEach(k=>{if(users.includes(k.username)){}})

if(answer.selection==menu.choices[4].value){ if (activeprofile!==undefined && activeprofile.disableai===false){ prompt(followplayer).then(answer=>{ bots.forEach(k=>{if(users.includes(k.username)){let plr = k.players[answer.username.toString()]; if(!plr){console.log(k.username+" couldn't locate"+answer.username.toString())}else{k.pathfinder.setMovements(new Movements(k,require('minecraft-data')(k.version)));k.pathfinder.setGoal(new GoalFollow(plr.entity, 2),true)  }}});literally1987(users)});}else{revert()}}

if(answer.selection==menu.choices[5].value){ bots.forEach(k=>{if(users.includes(k.username)){if(!k.pathfinder){}else{k.pathfinder.stop()}}}); literally1987(users) }
})
.catch()
}

function executecommand() {

}

function managetargets() {
  let menu = {
    name: "selection",
    type: "Select",
    message: "What's your next move?",
    choices: ["Go back", "Add server", "Remove server"]
  }
prompt(menu)
.then(answer=>{
  if(answer.selection==menu.choices[0].value){commandandconquer()}
  if(answer.selection==menu.choices[1].value){addserver(managetargets)}
  //if(answer.selection==menu.choices[2].value){selectserver(managetargets)} - Superseded by login menu
  if(answer.selection==menu.choices[2].value){delserver()}
})
.catch()
}


function addserver(returnto) {
  let menu = [{
    name: "IP",
    type: "Input",
    message: "Please input the server hostname",
    initial: "localhost"
  },
  {
    name: "Port",
    type: "Numeral",
    message: "Please input the server port [25565 is the default]",
}]
function ret(){if (returnto!==undefined) {returnto()}}
prompt(menu)
.then(answer=>{
let IP="localhost"; let P=25565; 
if(answer.IP!==""){IP=answer.IP}
if(answer.P!==""){P=answer.Port} 
targetlist[IP.toString()] = P;ret()})
.catch()
}

function selectserver(returnto) {
let menu = {
  name: "selection",
  type: "Select",
  message: "Please select a server",
  choices: Object.keys(targetlist)
}
function ret(){ if (returnto) {returnto()}}
menu.choices.push("Cancel")
prompt(menu)
.then(answer=>{ if (answer.selection!=="Cancel") {return [answer.selection.toString(),targetlist[answer.selection]];} else {ret(); return;}}) //[answer.selection.toString(),targetlist[answer.selection]]
.catch()
}

function delserver() {
  let menu = {
    name: "selection",
    type: "MultiSelect",
    message: "Remove any desired server from the list.",
    choices: Object.keys(targetlist)
  }
  if (Object.keys(targetlist).length>0){console.log("[Remember to press SPACE to select items then press ENTER to confirm!]")} else {console.log("The server list is empty!"); managetargets(); return}
  prompt(menu)
  .then(answer=>{answer.selection.forEach(function(x){if(activeprofile==targetlist[x]){activeprofile==undefined} delete targetlist[x]}); managetargets()})
  .catch()
}
//// These are the menus and functions that manage the botnet


mainmenu()


