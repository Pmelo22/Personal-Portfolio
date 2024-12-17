export function omit<T , K >(target: T, ...omitKeys: K[]): Omit<T, K> {
  return (Object.keys(target)).reduce(
    (res, key) => {
      if (!omitKeys.includes(key)) {
        res[key] = target[key];
      }
      return res;
    },
    {} 
  );
}

export function readFileAsync(file: any, asText: boolean = false) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result );
    };

    reader.onerror = reject;
    if (asText) {
      reader.readAsText(file);      
    }else{
       reader.readAsArrayBuffer(file);
      //reader.readAsText(file, 'utf8');
      //console.log('li e importei pro asText')
    }
  })
}

export function uuidv4() {
  //@ts-ignore
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}