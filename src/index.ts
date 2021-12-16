import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';


(async () => {
  const host = 'http://www.zvg-portal.de/';
  //const {default: fetch} = await import('node-fetch');
  const res = await fetch(host + 'index.php?button=Suchen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'ger_name=Bochum&order_by=2&land_abk=nw&ger_id=R2201&az1=&az2=&az3=&az4=&art=&obj=&str=&hnr=&plz=&ort=&ortsteil=&vtermin=&btermin='
  });

  const {window} = new JSDOM(await res.text());
  const doc = window.document;

  const table = doc.querySelector('#inhalt form table') as HTMLTableElement;
  const rows = table.querySelectorAll('tr');

  const urls = [];
  for (let i = 0; i < rows.length; i += 7) {
    const row = rows[i];
    const link = row.querySelector('a');
    urls.push(host + link.href);
  }

  console.log(urls);


  const res2 = await fetch(urls[0], {
    headers: {
      'Referer': host + 'index.php?button=Suchen'
    }
  });
  console.log(await res2.text());
})();
