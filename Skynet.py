from InquirerPy import inquirer # Port from the javascript version lol! (gay ass shit literally throttled because single core!)
from InquirerPy import prompt
from javascript import require, On, Once, AsyncTask, once, off
import asyncio
import os
import multiprocessing
import time
os.system('cls||clear')
print("Welcome to Skynet")
mineflayer = require('mineflayer')
pathfinder = require('mineflayer-pathfinder')
Vec3 = require('vec3').Vec3
pvp = require("mineflayer-pvp").plugin

botparams = {}
bots = []
targetlist = {}
currenttarget = None
activeprofile = None
threadslist = []

"""
class thread_with_trace(threading.Thread):
  def __init__(self, *args, **keywords):
    threading.Thread.__init__(self, *args, **keywords)
    self.killed = False
 
  def start(self):
    self.__run_backup = self.run
    self.run = self.__run     
    threading.Thread.start(self)
 
  def __run(self):
    sys.settrace(self.globaltrace)
    self.__run_backup()
    self.run = self.__run_backup
 
  def globaltrace(self, frame, event, arg):
    if event == 'call':
      return self.localtrace
    else:
      return None
 
  def localtrace(self, frame, event, arg):
    if self.killed:
      if event == 'line':
        raise SystemExit()
    return self.localtrace
 
  def kill(self):
    self.killed = True
"""
#      These are all the menus for profile management
def mainmenu():
 choices = ["Manage profiles","Manage instances","Crackhead shenanigans"]
 selection = inquirer.select(message="What would you like to do?",choices=choices).execute()
 if selection:
   if selection==choices[0]: botprofilemenu()
   if selection==choices[1]: commandandconquer()
   if selection==choices[2]: print("lol!"); mainmenu()

def botprofilemenu():
 choices= ["Go back","Create a profile","Select profile","Remove profile"]
 selection = inquirer.select(message="What would you like to do?",choices=choices).execute()
 if selection:
  if selection==choices[0]: mainmenu()
  if selection==choices[1]: createprofile(botprofilemenu)
  if selection==choices[2]: selectprofile(botprofilemenu)
  if selection==choices[3]: removeprofile()

def createprofile(returnto):
 inp = prompt(questions=[
  {
    "type": "input",
    "message": "What profile name do you desire?",
    "name": "profilename",
    "filter": lambda result: result if(result or result!="") else "profile",
    "transformer": lambda result: result if (result or result!="") else "profile" 
  },
  {
    "type": "input",
    "message": "What should the bot chat on login?",
    "name": "loginchat"
  },
  {
    "type": "confirm",
    "message": "Do you want to disable AI?",
    "name": "disableai"
  }
 ])
 if inp:
  name = inp['profilename']
  global botparams
  while (botparams.get(name)): name = name+"_clone"
  botparams[name] = inp
 returnto()

def selectprofile(returnto):
 sel = list(botparams.keys()) 
 sel.append("Cancel")
 def ret(): 
  if returnto!=None: 
    returnto()
 select = inquirer.select(message="Select to activate a profile.", choices=sel).execute()
 if select:
  if select!="Cancel":
    global activeprofile 
    activeprofile = botparams[select] 
 ret()

def removeprofile():
  global activeprofile
  if (len(list(botparams.keys()))>0): 
   print("[Remember to press SPACE to select items then press ENTER to confirm!]") 
   select = inquirer.checkbox(message="Delete any profiles at your heart's content",choices=list(botparams.keys())).execute()
   if select:
    for _ in select: 
     del botparams[_]
     if activeprofile!=None and activeprofile==_: activeprofile=None
   botprofilemenu()
  else: console.log("You don't have any profiles!"); botprofilemenu()
####

#### Server and botnet handling
def commandandconquer():
  choices = ["Go back","Manual login","Instance generation (offline servers)","Manage active instances","Manage targets"]
  selection = inquirer.select(message="Skynet",choices=choices).execute()
  if selection:
   if selection==choices[0]: mainmenu()
   if selection==choices[1]: manuallogin()
   if selection==choices[2]: generatebots()
   if selection==choices[3]: instancemenu()
   if selection==choices[4]: managetargets()

def manuallogin():
 if not len(list(targetlist.keys()))>0: 
  print("You don't have any servers to log into!")
  addserver(manuallogin)
  commandandconquer()
  
 else:
  if (currenttarget==None or currenttarget==""): 
   print("You have to select a server!")
   selectserver(manuallogin)
  else:
   auth = ["mojang","microsoft"]
   method = None
   authenticate = None
   cracked = inquirer.confirm(message="Are you willing to authenticate via password?").execute()
   if cracked: 
    method = inquirer.select(message="Choose your authentication method",choices=auth)
    if method:
     authenticate = inquirer.secret(message="Please input your account's password.").execute()
   username = prompt(questions=[{
   "type": "input",
   "message":"Type your desired username",
   "transformer":lambda result: result if (result or result!="") else "Notch", 
   "filter":lambda result: result if(result or result!="") else "Notch",
   }])
   profile = inquirer.confirm(message="Are you willing to use the active profile?").execute()
   thread_with_trace(generateinstance(username[0],currenttarget[0],currenttarget[1],profile,authenticate,method))

def managetargets():
 choices = ["Go back", "Add server", "Select server", "Remove server"]
 selection = inquirer.select(message="What's your next move?",choices=choices).execute()
 if selection:
  if selection==choices[0]: commandandconquer()
  if selection==choices[1]: addserver(managetargets)
  if selection==choices[2]: selectserver(managetargets)
  if selection==choices[3]: delserver()

def addserver(returnto):
 answer = prompt(questions=[{
    "name": "IP",
    "type": "input",
    "message": "Please input the server hostname",
    "filter": lambda result: result if(result or result!="") else "localhost",
    "transformer": lambda result: result if (result or result!="") else "localhost" 
  },
  {
    "name": "Port",
    "type": "number",
    "message": "Please input the server port [25565 is the default]",
    "filter": lambda result: int(result) if(result and int(result) and int(result)>0) else 25565,
    "transformer": lambda result: int(result) if(result and int(result) and int(result)>0) else 25565,
    "max_allowed": 65535,
    "default": 25565,
 }])
 if answer:
  global targetlist
  targetlist[str(answer['IP'])] = answer['Port']
 if returnto: 
  returnto()


def selectserver(returnto=commandandconquer):
 choices = list(targetlist.keys())
 choices.append("Cancel")
 selection = inquirer.select(message="Please select a server",choices=choices).execute()
 if selection:
  if selection!="Cancel": global currenttarget; currenttarget=[selection,targetlist[selection]]
 if returnto!=None: 
  returnto()
  


def delserver():
 choices = list(targetlist.keys())
 if len(choices)>0: 
  print("[Remember to press SPACE to select items then press ENTER to confirm!]")
  selection = inquirer.checkbox(message="Remove any desired server from the list.",choices=choices).execute()
  if selection:
   for _ in selection: 
    if activeprofile==targetlist[_]: activeprofile==None
    del targetlist[_]
 else: 
  console.log("The server list is empty!") 
 managetargets()

#thread.start_new_thread 


def generateinstance(user,ip,port,profile,pw,auth):
 async def __init__(user,ip,port,profile,pw,auth):
     u="Notch"
     h="localhost"
     p=25565
     pasw=""
     if(user!="" and user!=None): u=user
     if(ip!="" and ip!=None): h=ip
     if(port!="" and port!=None): p=port
     if(pw!="" and pw!=None): pasw=pw

     instance = mineflayer.createBot({"username": u,"port": p,"host": h,"password": pasw})
     if (instance==None): 
      print("wtf") 
      return
     bots.append(instance)
     status = None
     if (activeprofile!=None):
      if profile==True:
       instance.loadPlugin(pathfinder.pathfinder)
       @On(instance,"login") 
       def login(*args): 
         if activeprofile['loginchat']!="":
          instance.chat(activeprofile['loginchat'])
       @On(instance,"error")
       def error(*args):
        print(u+" had the following error: "+err)
        bots.remove(instance)
        del instance
        raise SystemExit()
       @On(instance,"end")
       def end(*args):
        bots.remove(instance) 
        del instance
        raise SystemExit()
      else:
       if (profile==True):
        print(u+" was to have a profile but there's none to give!")
      if (activeprofile['disableai']==False):
       @On(instance,"physicsTick")
       def physicsTick(*args):
        #len(list(filter(lambda e: e.username==entity.username, bots)))==0
        closestplr = instance.nearestEntity(lambda entity: entity.type == "player" and not (entity in bots)) #lookAt is borked on python! lol!11
        if closestplr: 
         instance.lookAt(closestplr.position.offset(0,1.62,0),True) #.offset(0,closestplr.height,0)

       @On(instance,"kicked")
       async def kicked(*args):
        bots.remove(instance)
        del instance
        await(10)
        generateinstance(u,h,p,profile,psw,auth)
        raise SystemExit()
 asyncio.run(__init__(user,ip,port,profile,pw,auth))

def generatebots():
 if not len(list(targetlist.keys()))>0: 
  print("You don't have any servers to log into!")
  addserver(generatebots)
 else:
  if (currenttarget==None or currenttarget==""): 
   print("You have to select a server!")
   selectserver(generatebots)
  else:
   config = prompt(questions=[
     {
     "type": "input",
     "message": "Type your desired bot prefix",
     "name": "prefix",
     "filter": lambda result: result if(result or result!="") else "profile",
     "transformer": lambda result: result if (result or result!="") else "profile" 
     },
     {
     "type": "number",
     "message": "How many bots do you want to generate in bulk?",
     "name": "amount",
     "filter": lambda result: int(result) if(result and int(result) and int(result)>0) else 5,
     "transformer": lambda result: int(result) if(result and int(result) and int(result)>0) else 5,
     "default": 5
     },
     {
     "type": "confirm",
     "message": "Do you want to use the current active profile?",
     "name": "profile",
     "default": True
     },
     {
     "type": "number",
     "message": "Set a delay inbetween bot generation (s)",
     "name": "time",
     "float_allowed":True,
     "replace_mode":True,
     "filter": lambda result: float(result) if(result and float(result)) else 4.5,
     "transformer": lambda result: float(result) if(result and float(result)) else 4.5,
     "default": 4.5
     }])
   if config:
    async def loop():
       for x in range(config['amount']):
        generateinstance(config['prefix']+str(x),currenttarget[0],currenttarget[1],config['profile'],"","")
        time.sleep(config['time'])
   asyncio.run(loop())
   commandandconquer()

"""
function instancemenu() {
  if (Object.keys(targetlist).length>0){} else {console.log("The server list is empty!"); commandandconquer(); return}
  if (currenttarget!==undefined && currenttarget!==""){} else {console.log("You have to select a server!"); selectserver(instancemenu()); return}
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
bots.forEach(k=>{t.push(k.username)})
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
let t = new Array()
bots.forEach(k=>{t.push(k.username)})
literally1987(t)
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
"""
#### These are the menus and functions that manage the botnet

mainmenu()
