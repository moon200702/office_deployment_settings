let productRows = [];
let channelRows = [];

const versionSelect = document.getElementById('versionSelect');
const productSelect = document.getElementById('productSelect');
const editionSelect = document.getElementById('editionSelect');
const channelSelect = document.getElementById('channelSelect');
const archSelect = document.getElementById('archSelect');
const languageSelect = document.getElementById('languageSelect');
const bundleSelect = document.getElementById('bundleSelect');
const pidMapInput = document.getElementById('pidMapInput');
const excludeAppsInput = document.getElementById('excludeAppsInput');
const summaryBox = document.getElementById('summary');
const xmlOutput = document.getElementById('xmlOutput');

async function init() {
  try {
    const [productCsv, channelCsv] = await Promise.all([
      fetch('./office_product_id.csv').then((response) => response.text()),
      fetch('./office_channel.csv').then((response) => response.text())
    ]);

    productRows = parseCsv(productCsv);
    channelRows = parseCsv(channelCsv);

    populateVersionOptions();
    bindEvents();
    generateXml();
  } catch (error) {
    summaryBox.textContent = `Unable to load CSV data: ${error.message}`;
    xmlOutput.value = '<!-- CSV data could not be loaded -->';
  }
}

function bindEvents() {
  versionSelect.addEventListener('change', () => {
    populateProductOptions();
    populateEditionOptions();
    populateChannelOptions();
    populateBundleOptions();
    generateXml();
  });

  productSelect.addEventListener('change', () => {
    populateEditionOptions();
    populateBundleOptions();
    generateXml();
  });

  [editionSelect, channelSelect, archSelect, languageSelect, bundleSelect, pidMapInput, excludeAppsInput].forEach((element) => {
    element.addEventListener('change', generateXml);
  });

  document.getElementById('generateBtn').addEventListener('click', generateXml);
  document.getElementById('downloadBtn').addEventListener('click', downloadXml);
}

function populateVersionOptions() {
  const versions = ['Microsoft 365 Apps', ...new Set(productRows.map((row) => row.Version))];
  versionSelect.innerHTML = versions
    .map((version) => `<option value="${escapeHtml(version)}">${escapeHtml(version)}</option>`)
    .join('');
  versionSelect.value = 'Microsoft 365 Apps';
  populateProductOptions();
  populateEditionOptions();
  populateChannelOptions();
  populateBundleOptions();
}

function populateProductOptions() {
  const version = versionSelect.value;
  let products = [];

  if (version === 'Microsoft 365 Apps') {
    products = ['Office', 'Project', 'Visio'];
  } else {
    products = [...new Set(productRows.filter((row) => row.Version === version).map((row) => row.Product))];
  }

  productSelect.innerHTML = products
    .map((product) => `<option value="${escapeHtml(product)}">${escapeHtml(product)}</option>`)
    .join('');
  productSelect.value = products[0] || '';
}

function populateEditionOptions() {
  const version = versionSelect.value;
  const product = productSelect.value;
  let editions = [];

  if (version === 'Microsoft 365 Apps') {
    editions = product === 'Office' ? ['ProPlus', 'Standard'] : ['Professional', 'Standard'];
  } else {
    editions = [...new Set(productRows.filter((row) => row.Version === version && row.Product === product).map((row) => row.Edition))];
  }

  editionSelect.innerHTML = editions
    .map((edition) => `<option value="${escapeHtml(edition)}">${escapeHtml(edition)}</option>`)
    .join('');
  editionSelect.value = editions[0] || '';
}

function populateChannelOptions() {
  const version = versionSelect.value;
  let filteredChannels = [];

  if (version === 'Microsoft 365 Apps') {
    filteredChannels = channelRows.filter((row) => row.ProductVersion === 'Microsoft 365 Apps');
  } else {
    const productVersion = mapVersionToProductVersion(version);
    filteredChannels = channelRows.filter((row) => row.ProductVersion === productVersion);
  }

  const channels = filteredChannels.map((row) => row.Channel);
  channelSelect.innerHTML = channels
    .map((channel) => `<option value="${escapeHtml(channel)}">${escapeHtml(channel)}</option>`)
    .join('');
  channelSelect.value = channels[0] || '';
}

function populateBundleOptions() {
  const options = [];
  const version = versionSelect.value;
  const product = productSelect.value;
  const edition = editionSelect.value;

  productRows.forEach((row) => {
    options.push({
      value: `${row.Version}|${row.Product}|${row.Edition}`,
      label: `${row.Product} - ${row.Edition} - ${row.Version}`
    });
  });

  bundleSelect.innerHTML = options
    .map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
    .join('');

  const currentValue = `${version}|${product}|${edition}`;
  const currentOption = Array.from(bundleSelect.options).find((option) => option.value === currentValue);
  if (currentOption && bundleSelect.selectedOptions.length === 0) {
    currentOption.selected = true;
  }
}

function mapVersionToProductVersion(version) {
  const mapping = {
    '2019': 'Office 2019',
    '2021 LTSC': 'Office LTSC 2021',
    '2024 LTSC': 'Office LTSC 2024'
  };
  return mapping[version] || version;
}

function generateXml() {
  const arch = archSelect.value;
  const channel = channelSelect.value;
  const language = languageSelect.value;
  const pidMap = parsePidMap(pidMapInput.value);
  const excludeApps = parseExcludeApps(excludeAppsInput.value);
  const selectedProducts = getSelectedProducts();

  const productXml = selectedProducts
    .map((item) => {
      const productId = getProductId(item.version, item.product, item.edition);
      const attributes = [`ID="${productId}"`];
      const overrideKey = pidMap[productId];
      if (overrideKey) {
        attributes.push(`PIDKEY="${overrideKey}"`);
      }

      const lines = [`  <Product ${attributes.join(' ')}>`];
      lines.push(`    <Language ID="${language}" />`);
      excludeApps.forEach((app) => {
        lines.push(`    <ExcludeApp ID="${app}" />`);
      });
      lines.push('  </Product>');
      return lines.join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Configuration ID="${generateGuid()}">
  <Add OfficeClientEdition="${arch}" Channel="${channel}">
${productXml}
  </Add>
  <Property Name="SharedComputerLicensing" Value="0" />
  <Property Name="FORCEAPPSHUTDOWN" Value="FALSE" />
  <Property Name="DeviceBasedLicensing" Value="0" />
  <Property Name="SCLCacheOverride" Value="0" />
  <Property Name="AUTOACTIVATE" Value="1" />
  <Updates Enabled="TRUE" />
  <Display Level="Full" AcceptEULA="TRUE" />
  <RemoveMSI />
</Configuration>`;

  xmlOutput.value = xml;
  summaryBox.innerHTML = `
    <strong>Selected products:</strong> ${escapeHtml(selectedProducts.map(formatProductLabel).join(', '))}<br>
    <strong>Channel:</strong> ${escapeHtml(channel)}<br>
    <strong>Architecture:</strong> ${escapeHtml(arch === '64' ? '64-bit' : '32-bit')}
  `;
}

function getSelectedProducts() {
  const selectedValues = Array.from(bundleSelect.selectedOptions).map((option) => option.value);

  if (!selectedValues.length) {
    return [{ version: versionSelect.value, product: productSelect.value, edition: editionSelect.value }];
  }

  return selectedValues.map((value) => {
    const [version, product, edition] = value.split('|');
    return { version, product, edition };
  });
}

function formatProductLabel(item) {
  return `${item.product} ${item.edition} (${item.version})`;
}

function parsePidMap(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((map, line) => {
      const [key, pid] = line.split('=').map((part) => part.trim());
      if (key && pid) {
        map[key] = pid;
      }
      return map;
    }, {});
}

function parseExcludeApps(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getProductId(version, product, edition) {
  if (version === 'Microsoft 365 Apps') {
    const fallback = {
      Office: {
        ProPlus: 'O365ProPlusRetail',
        Standard: 'O365BusinessRetail'
      },
      Project: {
        Professional: 'ProjectProRetail',
        Standard: 'ProjectStdRetail'
      },
      Visio: {
        Professional: 'VisioProRetail',
        Standard: 'VisioStdRetail'
      }
    };
    return fallback[product]?.[edition] || 'O365ProPlusRetail';
  }

  const match = productRows.find((row) => row.Version === version && row.Product === product && row.Edition === edition);
  return match?.ProductID || '';
}

function downloadXml() {
  const blob = new Blob([xmlOutput.value], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'configure.xml';
  link.click();
  URL.revokeObjectURL(url);
}

function parseCsv(text) {
  const rows = [];
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return rows;

  const headers = splitCsvLine(lines[0]);

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = splitCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

function splitCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;');
}

init();
