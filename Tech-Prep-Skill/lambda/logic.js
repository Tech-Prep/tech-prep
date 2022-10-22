const axios = require("axios");
// const { addS3Object, getS3Object, deleteS3Object } = require('./s3');

const options = {
    method: 'GET',
    url: 'https://jsearch.p.rapidapi.com/search',
    params: {
        query: 'software developer',
        page: '1',
        date_posted: 'today',
        remote_jobs_only: 'true',
        num_pages: '1'
    },
    headers: {
        'X-RapidAPI-Key': '06a16c25e6msh7182d6c514e7e7bp1047ddjsne068aa9f6a0e',
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
};

module.exports.fetchJobsApi = async function fetchJobsApi() {
    let config = {
        timeout: 6500
    }

    try {
        const response = await axios.request(options, config);

        return response.data;
    } catch (error) {
        console.log('^^^^^^^^^^ERROR', error);
        return null;
    }
}
