# Metadata Manager

Metadata Manager is an web application to manually register and update metadata with Crossref for the scholarly works they publish including journal articles, books, working papers, theses, datasets, etc. This metadata might include a host of information on the publication's contributor(s) (name, affiliation, etc.), funding, license, etc. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

* npm install
* Use 'npm start' to run a development server with brunch. The brunch development server is not affected by settings set in the config.js file in root. That file is for setting production build preferances
* You can also 'npm run gulp' to test the production build. This will use the config.js settings, so if setting a root directory, the build will expect to be run from there.


## Deployment

* npm run build
* Copy the contents of public folder created in root to the deployment server root folder


## Built With

* This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Versioning

For the versions available, see the [tags on this repository](https://github.com/CrossRef/mdt-ui/releases). 

## Authors

See also the list of [contributors](https://github.com/CrossRef/mdt-ui/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


