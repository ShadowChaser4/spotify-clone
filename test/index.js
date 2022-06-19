

  async function play() 
    {
        const response = await fetch("http://localhost:2000/music/musicname"); 
        const blob = new Blob(response.blob(), { type: 'application/mp3' }); 
        const url = window.URL.createObjectURL(blob); 
        console.log(url)
        const audio = new Audio(url); 
        audio.load(); 
        await audio.play(); 
    }

document.addEventListener('click', play)