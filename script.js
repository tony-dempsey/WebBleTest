const button = document.getElementById("getDetails");
const details = document.getElementById("details");

button.addEventListener("click", async () => {
   try {
      const device = await navigator.bluetooth.requestDevice({
         acceptAllDevices: true,
         });

      // Connect to the GATT server
      // We also get the name of the Bluetooth device here
      let deviceName = device.gatt.device.name;
      const server = await device.gatt.connect(); 

      // Getting the current battery level
      const batteryLevelCharacteristic = await batteryService.getCharacteristic(
         "battery_level");
      
      // Convert received buffer to number
      const batteryLevel = await batteryLevelCharacteristic.readValue();
      const batteryPercent = await batteryLevel.getUint8(0);

      // Getting device information
      // We will get all characteristics from device_information
      const infoCharacteristics = await infoService.getCharacteristics();
      console.log(infoCharacteristics);
      let infoValues = [];
      const promise = new Promise((resolve, reject) => {
         infoCharacteristics.forEach(async (characteristic, index, array) => {
            // Returns a buffer
            const value = await characteristic.readValue();
            console.log(new TextDecoder().decode(value));
            // Convert the buffer to string
            infoValues.push(new TextDecoder().decode(value));
            if (index === array.length - 1) resolve();
            });
         });
      promise.then(() => {
         // Display all the information on the screen
         // use innerHTML
         details.innerHTML = `
            Device Name - ${deviceName}<br />
            Battery Level - ${batteryPercent}%<br />
            Device Information:
            <ul>
            ${infoValues.map((value) => `<li>${value}</li>`).join("")}
            </ul> 
            `;
          });
      } 
   catch(err) {
      alert("An error occured while fetching device details");
      }
});
