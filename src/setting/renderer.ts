let channelFormElement = document.getElementById('twitch-channel-name-form');


if ( channelFormElement ) {
  channelFormElement.addEventListener('click',async (e: Event) => {
    e.preventDefault();
    let channelElement = <HTMLInputElement>document.getElementById('twitch-channel-name');
    if( channelElement ) {
      let channelName = channelElement.value;
      await window.electron.onSetChannel(channelName);
      console.log(`[INFO] set channel ${channelName}`);
    }
  });
}


