## Backend
The app is an `express` based REST API, using `mongoose` as ORM.
We have used a `models` and `routes` folder, additionally we can use a `controllers` folder as well to organize the code better as codebase grows.
Using `multer` for uploads, we store images in `disk` till we save it in `mongodb` additionally we should be using an object storage instead like `S3`.
### Setup

Get MongoDB running locally
```sh
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
```

- `cd backend`
- copy the env vars from `.env.sample` to `.env` and set your backend url if its different from default 5001
- `npm i`
- `npm run dev`


## Frontend

The frontend is a react app based on vite, uses primarily `bootstrap` and `react-bootstrap` for styling.
`@hello-pangea/dnd` for the drag and drop functionality which is a successor to `react-beautiful-dnd`


### Setup
- `cd frontend`
- copy the env vars from `.env.sample` to `.env` and set your backend url if its different from default 5001
- `npm i`
- `npm run dev`
