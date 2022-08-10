const { Worker, isMainThread, workerData, parentPort} = require('worker_threads')
const mineflayer = require('mineflayer');
const pvp = require("mineflayer-pvp").plugin
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const worker = this
var bots = []
var errors = []
//this.onmessage("message", list=>{bots=list} )

if (isMainThread) {} else{

  let u="Notch"; if(workerData[0]!=="" && workerData[0]!==undefined){u=workerData[0]}
  let h="localhost"; if(workerData[3]!=="" && workerData[3]!==undefined){h=workerData[3]}
  let p=25565; if(workerData[4]!=="" && workerData[4]!==undefined){p=workerData[4]}
  let pass; if(workerData[5]!=="" && workerData[5]!==undefined){pass=workerData[5]}

  let instance = mineflayer.createBot({username: u,port: p,host: h,password: pass, logErrors: false})
  if (instance===undefined){console.log("wtf");return}
  let status;
  instance.on("error",(err)=>{
    //errors.push(u+" had the following error: "+err)
  })
  parentPort.on('message', (event) => {
    //instance.chat(event)
    if (typeof(event)==="object" && event.list!==undefined) {console.log(event)}
  })
  parentPort.postMessage({creation: u})
  instance.on("end",(a)=>{/*console.log("Server connection with "+instance.username+" has ended: "+a);*/ parentPort.postMessage("killme"); })
  if (workerData[1]!==undefined){ if (workerData[2]===true){
  instance.loadPlugin(pathfinder)
  //instance.on("quit",(a)=>{/*console.log("Instance "+instance.username+" has quit: "+a);*/ bots.splice(bots.indexOf(instance),1); instance.removeAllListeners(); collectgarbage()})
  instance.on("login",()=>{if (workerData[1].loginchat!=="") {instance.chat(workerData[1].loginchat.toString())}})

  if (workerData[1].disableai===false){ 
  instance.on("physicsTick",()=>{
  const player = (entity) => entity.type === "player" && !bots.find(e=>e.username==entity.username); let closestplr = instance.nearestEntity(player)
  if (!closestplr) return; instance.lookAt(closestplr.position.offset(0,closestplr.height,0),true)
  })

  instance.on("kicked",()=>{
  setTimeout(function(){parentPort.postMessage("rejoin");},10000)
  });

 
  }}

  }else{if(workerData[2]===true){console.log(u+" was to have a profile but there's none to give!")}}

}


