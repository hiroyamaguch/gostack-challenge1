const express = require("express");
const cors = require("cors");
const { v4 } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: v4(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.send(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(project => project.id === id);

  if(repositoryIndex < 0){
    return response.status(400).send({ err: 'Repository not found!' });
  }

  const repository = repositories[repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.send(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(project => project.id === id);

  if(repositoryIndex < 0){
    return response.status(400).send({ err: 'Repository not found!' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(project => project.id === id);

  if(repositoryIndex < 0){
    return response.status(400).send({ err: 'Repository not found!' });
  }

  repositories[repositoryIndex].likes++;

  return response.send(repositories[repositoryIndex]);
});

module.exports = app;
