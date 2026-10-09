
document.addEventListener('DOMContentLoaded', () => {
  ClaimsUI.bindRoutes();
  ClaimsUI.createTable(document.getElementById('allClaimsCard'), { pageSize: 10, defaultStatus: '', attention: false });
});
