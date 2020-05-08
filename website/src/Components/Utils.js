async function patchData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.text(); // parses JSON response into native JavaScript objects
}

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.text(); // parses JSON response into native JavaScript objects
}

export { patchData, postData };