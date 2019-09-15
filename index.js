let numberRequests=0;

const express = require('express');
const server = express();
server.use(express.json());

const projects = [];




//middlewares
function addRequest(req,res,next){
    numberRequests++;
    console.log(`total requests: ${numberRequests}`);
    return next();
}

//add o middleware GLOBAL
server.use(addRequest)

//middleware especifico, usado em delete/put p saber se o proj exisxte antes de atuar.
function projectExists(req,res,next){

    const {id} = req.params;
    const project = projects.find(p => p.id == id);

    if(!project) {
        return res.status(400).json({error:"project not found"})
    }

    return next();

}






//rotas

//post
server.post('/projects', (req,res) =>{

    const {id, title} = req.body;

    const project =  {
        id,
        title,
        tasks:[]
    }

    projects.push(project);
    return res.json(projects);

})


//posts tasks
server.post('/projects/:id/tasks', projectExists, (req,res) =>{
    
    const {id} = req.params;
    const {title} = req.body;

    const project = projects.find(p => p.id == id); //find it
    project.tasks.push(title);

    return res.json(project);

})

//get
server.get('/projects', (req,res)=>{
    return res.json(projects);
})

//put
server.put('/projects/:id', projectExists, (req,res)=>{

    const {title} = req.body;
    const {id} = req.params;

    //find it
    //const project = projects[id];

    //other way of finding
    const project = projects.find(p => p.id == id);
    //update title
    project.title = title;
    //update in matrix
    projects[id] = project;

    return res.json(projects);

})

//delete
server.delete('/projects/:id', projectExists, (req,res)=>{

    const {id} = req.params;

    const projectIdx = projects.findIndex(p => p.id == id);

    projects.splice(projectIdx,1);

    return res.json(projects);

})




server.listen(3001);
