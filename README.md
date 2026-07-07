1.the office installation file name setup.exe and download from this website  
https://www.microsoft.com/en-us/download/details.aspx?id=49117

2.if the office vertion are 2024 or 365 you can set the configure.xml from this website and download it  
https://config.office.com/deploymentsettings

3.the configure.xml all the tags and funtion detail from here  
https://learn.microsoft.com/zh-tw/microsoft-365-apps/deploy/office-deployment-tool-configuration-options

4.the configure.xml all production of office product ID list   
https://learn.microsoft.com/zh-tw/previous-versions/troubleshoot/microsoft-365/microsoft-365-apps/office-suite-problems/product-ids-supported-office-deployment-click-to-run

5.put setup.exe configure.xml in the same florder and run the cmd as administrator    
setup.exe /configure configuration.xml  

6.setup.exe  
Office Deployment Tool  

Setup [mode] [path]  
  
Setup /download [path to configuration file]  
Setup /configure [path to configuration file]  
Setup /customize [path to configuration file]  
Setup /help  
  
 /download Downloads files to create an Office installation source  
 /configure Adds, removes, or configures an Office installation  
 /customize Applies settings for Office applications  
 /help Displays this message  
