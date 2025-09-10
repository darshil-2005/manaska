# Manaska


## Setup Up Locally


Follow the steps below to set up the project on your local machine.

---

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) on your machine.
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) for running the PostgreSQL database.

---

### Steps

#### 1. Clone the respository
```bash
#SSH
git clone git@github.com:VrundDA/manaska.git

#OR

#HTTP   
git clone https://github.com/VrundDA/manaska.git
```

#### 2. Install Dependencies
Run the following commands to navigate to project folder and download node_module packages:
```bash
# Go into project directory
cd manaska/
# Install node_module packages
npm install
```

#### 3. Rename .env.example to .env
Rename the ".env.example" file in the root folder to ".env".
```bash 
# Rename file using command or do it manually in your code editor.
mv .env.example .env
```

#### 4. Start the postgreSQL database and pgAdmin

***NOTE: Make sure you have installed **docker** and **docker-compose** on your machine.***

Navigate to ***db/startdb*** and run the following command:
```bash
# Starts a postgres database on 5432 port and pgadmin on port 8080 on localhost.
# Check /db/startdb/docker-compose.yaml for details.
docker compose up -d
```

Check if the docker containers are running with the following command:
```bash
# List all running docker containers.
docker ps
```
If you see the following containers in the list, everything was successful:
| CONTAINER ID |      IMAGE        |     COMMAND            |        CREATED   |    STATUS     |         PORTS                                     |    NAMES       |
|--------------|-------------------|------------------------|------------------|---------------|---------------------------------------------------|----------------|
|ab7bc27513b6  |  dpage/pgadmin4   | "/entrypoint.sh"       |  50 minutes ago  | Up 50 minutes |  443/tcp, 0.0.0.0:8080->80/tcp, [::]:8080->80/tcp |  manaskapgadmin|
|2259634cef9f  |  postgres:latest  | "docker-entrypoint.s…" |  57 minutes ago  | Up 50 minutes | 0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp       |  manaskadb     |

You can also check if pgadmin is working by going to [localhost:8080](localhost:8080).

```yml
# Login Credentials for pgadmin are:
Email: student@dau.ac.in
Password: student
```

#### 5. Run Migrations to fill the database.
Run the following command to fill your local database on 5432 port to match the schema defined in ***db/schema.ts***.
```bash
npx drizzle-kit migrate
```
After running, check your local postgres database on port 5432. It should contain the users table defined in ***db/schema.ts***.

#### 6. Start the development server

Now you can navigate back to the root directory and start the development server by running:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

___


### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
