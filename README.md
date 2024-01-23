# Test - Brain Agriculture

Technical assessment for senior backend position.

## Running the project

1. Clone the repository to your local machine

2. Open a terminal on the root folder

3. Create a `.env` file on the root folder according to `.env.example` file

> **_NOTE:_** To start the application with mock data, use the default POSTGRES variables from `.env.example` file

4. Run the following command
```docker compose up -d```

5. The API will run on `localhost:${PORT}`

## Testing the API

Use the file `insomnia.json` on `docs` folder for greater ease of testing. 
Simply [import the file](https://docs.insomnia.rest/insomnia/import-export-data#import-data) to your insomnia application.