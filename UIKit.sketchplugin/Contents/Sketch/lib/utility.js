
function Utility() {}

Utility.contains = function(arr, needle) {
    for (i in arr) {
        if (arr[i] == needle) {
            return true;
        }
    }
    return false;
}

Utility.platformIndex = function(platform) {
  if (platform === "Desktop") return 1
  if (platform === "Tablet") return 2
  if (platform === "Mobile") return 3
  return 4
}

Utility.atomicIndex = function(library) {
  if (library.indexOf("Atoms") !== -1) return 1
  if (library.indexOf("Molecules") !== -1) return 2
  if (library.indexOf("Organisms") !== -1) return 3
  return 4
}
