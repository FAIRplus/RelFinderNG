RelFinder evolution

##Docker image creation (with out CI/CD pipeline)
	Step 1: Ensure docker demon is running
	Step 2: Open Command prompt and navigate to project
	Step 3: Execute below command to build Docker image
				docker build -t <image_name>:<tag> .
				
	Note: If you want to change proxy server url, change in src/app/config/config.json file before building the image
	
##Local Development Steps:

## Environment setup

Verify that Node.js is installed (node -v). Download Nodejs from [Nodejs Download](https://nodejs.org/en/download/)
Verify that Angular is installed (ng version). If not installed install angular using `npm install -g @angular/cli` command
Navigate to project folder aund upgrade/install dependencies (npm install)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
Note: By default angular runs applicaiton in port 4200. If you want to change port execute command `ng serve --port 5000`

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Code coverage

Run `ng test --code-coverage` will generate coverage report

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
