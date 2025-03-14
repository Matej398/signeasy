# Terminal Cheatsheet

A modern, responsive website displaying terminal commands for GitHub, Windows, Mac, and VPS. This project is part of the [CodeLabHaven](https://codelabhaven.com) portfolio.

## Setup Instructions

### VPS Setup

1. The project should be deployed to the portfolio's projects directory:
```bash
cd /var/www/codelabhaven/projects
git clone https://github.com/Matej398/terminal-cheatsheet.git
```

2. Update Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/codelabhaven
```
Add the following location block:
```nginx
location /projects/terminal-cheatsheet/ {
    alias /var/www/codelabhaven/projects/terminal-cheatsheet/;
    try_files $uri $uri/ /projects/terminal-cheatsheet/index.html;
    index index.html;
}
```

3. Test and restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### GitHub Setup

1. Add the following secrets to your GitHub repository:
   - `VPS_HOST`: Your VPS IP address
   - `VPS_USERNAME`: Your VPS username
   - `VPS_SSH_KEY`: Your SSH private key for VPS access

2. Push the code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Matej398/terminal-cheatsheet.git
git push -u origin main
```

The website will be automatically deployed to your portfolio site at https://codelabhaven.com/projects/terminal-cheatsheet/ whenever you push changes to the main branch. 