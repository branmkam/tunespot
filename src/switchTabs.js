export default function switchTabs(evt, tabName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("content-tab");
  for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tab");
  for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" is-active has-text-link", "");
  }
  document.getElementById(tabName).style.display = "block";
  document.getElementById(tabName + 'Tab').className += " is-active has-text-link";
}