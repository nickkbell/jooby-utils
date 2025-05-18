const ORGANIZATION_ID = '001a79';
const PROTOCOL_ID = '88';
const DEVICE_ID_SIZE = 18;
const EUI_SIZE = 16;

const conversionType = document.getElementById('conversion-type');
const deviceIdFields = document.getElementById('deviceid-fields');
const euiFields = document.getElementById('eui-fields');
const convertBtn = document.getElementById('convert-btn');
const resultDiv = document.getElementById('result');
const resultText = document.getElementById('result-text');

const deviceIdInput = document.getElementById('deviceid-input');
const modelCodeInput = document.getElementById('model-code');
const euiInput = document.getElementById('eui-input');

const deviceIdError = document.getElementById('deviceid-error');
const modelCodeError = document.getElementById('model-code-error');
const euiError = document.getElementById('eui-error');

function handleConvert() {
    clearErrors();
    
    if (conversionType.value === 'deviceid-to-eui') {
        const deviceId = deviceIdInput.value.trim();
        
        if (!isValidDeviceId(deviceId)) {
            deviceIdError.classList.remove('hidden');
            return;
        }
        
        const eui = getEuiFromDeviceId(deviceId);
        if (eui) {
            resultText.innerHTML = `EUI: <strong>${eui}</strong>`;
            resultDiv.classList.remove('hidden');
        }
    } else {
        const modelCode = modelCodeInput.value.trim();
        const eui = euiInput.value.trim();
        
        if (!modelCode) {
            modelCodeError.classList.remove('hidden');
            return;
        }
        
        if (!isValidEui(eui)) {
            euiError.classList.remove('hidden');
            return;
        }
        
        const deviceId = getDeviceIdFromEui(modelCode, eui);
        if (deviceId) {
            resultText.innerHTML = `DevCode: <strong>${deviceId}</strong>`;
            resultDiv.classList.remove('hidden');
        }
    }
}

conversionType.addEventListener('change', function() {
    if (this.value === 'deviceid-to-eui') {
        deviceIdFields.classList.remove('hidden');
        euiFields.classList.add('hidden');
    } else {
        deviceIdFields.classList.add('hidden');
        euiFields.classList.remove('hidden');
    }
    resultDiv.classList.add('hidden');
    clearErrors();
});

convertBtn.addEventListener('click', handleConvert);

deviceIdInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleConvert();
    }
});

modelCodeInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleConvert();
    }
});

euiInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleConvert();
    }
});

function isValidDeviceId(deviceId) {
    if (typeof deviceId !== 'string' || deviceId.length !== DEVICE_ID_SIZE) {
        return false;
    }
    
    const regex = /^\d{4}\.\d{8}\.\d{4}$/;
    return regex.test(deviceId);
}

function isValidEui(eui) {
    if (typeof eui !== 'string' || eui.length !== EUI_SIZE) {
        return false;
    }
    
    const regex = /^[0-9a-f]{16}$/i;
    return regex.test(eui);
}

function clearErrors() {
    deviceIdError.classList.add('hidden');
    modelCodeError.classList.add('hidden');
    euiError.classList.add('hidden');
}


function getEuiFromDeviceId(deviceId) {
    if (!isValidDeviceId(deviceId)) {
        return null;
    }

    const [, number, year] = deviceId.split('.');
    const hexNumber = parseInt(number.slice(2), 10).toString(16).padStart(6, '0');
    const hexYear = parseInt(year.slice(2), 10).toString(16).padStart(2, '0');

    return `${ORGANIZATION_ID}${PROTOCOL_ID}${hexYear}${hexNumber}`;
}

function getDeviceIdFromEui(modelCode, eui) {
    if (!modelCode || !isValidEui(eui)) {
        return null;
    }

    modelCode = modelCode.toString().padStart(4, '0');

    const hexYear = eui.slice(8, 10);
    const hexNumber = eui.slice(10);

    const year = parseInt(hexYear, 16).toString().padStart(2, '0');
    const number = parseInt(hexNumber, 16).toString().padStart(6, '0');

    return `${modelCode}.00${number}.20${year}`;
}