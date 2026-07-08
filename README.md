# 📦 Office Deployment Tool Guide / Office 部署工具指南

---



### 🛠️ Project Overview

This project uses GitHub Codespaces and GitHub Copilot as an AI coding assistant.

### 📥 Download the Office Deployment Tool (setup.exe)

- Download the Office Deployment Tool (setup.exe)
- Official download: [Microsoft Download Center](https://www.microsoft.com/en-us/download/details.aspx?id=49117)

### ⚙️ Configure for Office 2024 or Microsoft 365

- Configure for Office 2024 or Microsoft 365
- Use the Office Customization Tool to build and download a configuration XML: [Office Customization Tool](https://config.office.com/deploymentsettings)

### 📚 Reference for configuration options

- Full configuration.xml options and tag reference: [Microsoft Learn - Office Deployment Tool configuration options](https://learn.microsoft.com/zh-tw/microsoft-365-apps/deploy/office-deployment-tool-configuration-options)

### 🆔 Product ID reference

- List of product IDs supported by the Office Deployment Tool: [Microsoft Learn - Product IDs supported by Office Deployment Tool](https://learn.microsoft.com/zh-tw/previous-versions/troubleshoot/microsoft-365/microsoft-365-apps/office-suite-problems/product-ids-supported-office-deployment-click-to-run)

### 🚀 Run the installation using setup.exe

- Put setup.exe and your configuration.xml in the same folder, then run (as administrator):

```bash
setup.exe /configure configuration.xml
```

### 🧰 setup.exe usage (Office Deployment Tool)

- setup [mode] [path]
- Common modes:
- setup /download [path to configuration file] — Download files to create an Office installation source
- setup /configure [path to configuration file] — Add, remove, or configure an Office installation
- setup /customize [path to configuration file] — Apply settings for Office applications
- setup /help — Display help message

### ⚠️ Notes

- Make sure the product IDs and channels you choose are compatible with the Office versions you deploy.
- Always test your configuration in a lab environment before rolling out to production.

---



### 🛠️ 專案說明

本專案使用 GitHub Codespaces 與 GitHub Copilot 作為 AI 程式開發輔助工具。

### 📥 下載 Office 部署工具（setup.exe）

- 下載 Office 部署工具（setup.exe）
- 官方下載： [Microsoft 下載中心](https://www.microsoft.com/zh-tw/download/details.aspx?id=49117)

### ⚙️ 為 Office 2024 或 Microsoft 365 設定

- 為 Office 2024 或 Microsoft 365 設定
- 使用 Office 自訂工具建立並下載 configuration.xml： [Office Customization Tool](https://config.office.com/deploymentsettings)

### 📚 設定選項參考

- configuration.xml 的完整標記與選項說明： [Microsoft Learn - Office 部署工具設定選項](https://learn.microsoft.com/zh-tw/microsoft-365-apps/deploy/office-deployment-tool-configuration-options)

### 🆔 產品 ID 參考

- Office 部署工具支援的產品 ID 列表： [Microsoft Learn - Office 部署工具支援的產品 ID](https://learn.microsoft.com/zh-tw/previous-versions/troubleshoot/microsoft-365/microsoft-365-apps/office-suite-problems/product-ids-supported-office-deployment-click-to-run)

### 🚀 使用 setup.exe 執行安裝

- 將 setup.exe 與 configuration.xml 放在同一資料夾，然後以系統管理員執行：

```bash
setup.exe /configure configuration.xml
```

### 🧰 setup.exe 用法（Office 部署工具）

- setup [mode] [path]
- 常見模式：
- setup /download [path to configuration file] — 下載檔案以建立 Office 安裝來源
- setup /configure [path to configuration file] — 新增、移除或設定 Office 安裝
- setup /customize [path to configuration file] — 套用 Office 應用程式的設定
- setup /help — 顯示說明訊息

### ⚠️ 注意事項

- 請確認您選擇的product IDs和channels與要部署的 Office 版本相容。
- 請先在測試環境驗證您的設定，再部署至正式環境。
