"use strict";
const Web3Modal = window.Web3Modal.default
    , WalletConnectProvider = window.WalletConnectProvider.default
    , Fortmatic = window.Fortmatic
    , Authereum = window.Authereum;
let web3Modal, provider, selectedAccount, started, contract;


function isConnected() {
    web3Modal.cachedProvider && onConnect();
}

function error_msg(e) {
    Swal.fire({
        icon: "error"
        , title: "Oops..."
        , text: e
    });
}

function success_msg(e) {
    Swal.fire("NFT Minted", 'You have minted "' + e + '" NFT(s) successfully!', "success");
}




function init() {
    web3Modal = new Web3Modal({
        cacheProvider: !0
        , providerOptions: {
            walletconnect: {
                package: WalletConnectProvider
                , options: {
                    infuraId: "8043bb2cf99347b1bfadfb233c5325c0"
                }
            }
            , authereum: {
                package: Authereum
                , networkName: "mainnet"
                , apiKey: "y7edbh5uw4eTpLg8JAk7tHdzfMOT6wlB"
            }
            , fortmatic: {
                package: Fortmatic
                , options: {
                    key: "pk_test_391E26A3B43A3350"
                }
            }
        }
        , disableInjectedProvider: !1
    }), isConnected()
}
async function switch_bsc() {
    try {
        await ethereum.request({
            method: "wallet_switchEthereumChain"
            , params: [{
                chainId: "0x38"
            }]
        })
    } catch (e) {
        if (4902 === e.code) try {
            await ethereum.request({
                method: "wallet_addEthereumChain"
                , params: [{
                    chainId: "0x38"
                    , rpcUrl: "https://bsc-dataseed.binance.org/"
                }]
            })
        } catch (e) {}
    }
}
async function switch_ethr() {
    try {
        await ethereum.request({
            method: "wallet_switchEthereumChain"
            , params: [{
                chainId: "0x1"
            }]
        })
    } catch (e) {
        if (4902 === e.code) try {
            await ethereum.request({
                method: "wallet_addEthereumChain"
                , params: [{
                    chainId: "0x1"
                    , rpcUrl: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
                }]
            })
        } catch (e) {}
    }
}
async function getAddress() {
    const e = new Web3(provider);
    
    return await e.currentProvider.selectedAddress
}
async function fetchAccountData() {
    const e = new Web3(provider)
        , t = await e.eth.getChainId()
        , n = (evmChains.getChain(t), await e.eth.getAccounts());
    selectedAccount = n[0];
    const a = n.map(async t => {
        const n = await e.eth.getBalance(t)
            , a = e.utils.fromWei(n, "ether")
            , i = parseFloat(a)
            .toFixed(2);
        console.log(i), $(".balance")
            .html(selectedAccount.substring(0, 4) + ".. | " + i + " ETH");
        console.log("connected");
        console.log(await getAddress());
        deleteChild();
        const options = {
            method: 'GET'
            , url: 'https://api.opensea.io/api/v1/assets'
            , params: {
                owner: await getAddress()
                , order_direction: 'desc'
                , limit: '20'
                , include_orders: 'false'
            }
            , headers: {
                accept: 'application/json'
                , 'X-API-KEY': '6f77ff2a8d164976af7639539e5a4688'
            }
        };
        
        axios
            .request(options)
            .then(function (response) {
                
                console.log([0]);
                
                const _galleryRoot = document.getElementById("GalleryParent")
                    .parentElement.parentElement;
                _galleryRoot.style.display = "block";
                
                response.data['assets'].forEach(element => {
                    console.log(element['image_url']);
                    
                    generateArt(element['name'], element['permalink'], element['image_url'], element['description']);
                    
                });
                
            })
            .catch(function (error) {
                console.error(error);
            });
        
    });
    await Promise.all(a), document.querySelector(".prepare")
        .style.display = "none", document.querySelector(".connected")
        .style.display = "block", document.querySelector(".balance")
        .style.display = "block"
}
async function refreshAccountData() {
    document.querySelector(".connected")
        .style.display = "none", document.querySelector(".prepare")
        .style.display = "block", document.querySelector(".btn-connect")
        .setAttribute("disabled", "disabled"), await fetchAccountData(provider), document.querySelector(".btn-connect")
        .removeAttribute("disabled")
}
async function onConnect() {
    try {
        provider = await web3Modal.connect()
    } catch (e) {
        return void console.log("Could not get a wallet connection", e)
    }
    provider.on("accountsChanged", e => {
        fetchAccountData()
    }), provider.on("chainChanged", e => {
        fetchAccountData()
    }), provider.on("networkChanged", e => {
        fetchAccountData()
    }), await refreshAccountData()
}
async function onDisconnect() {
    const _galleryRoot = document.getElementById("GalleryParent")
        .parentElement.parentElement;
    _galleryRoot.style.display = "none";
    console.log("Killing the wallet connection", provider), web3Modal.clearCachedProvider(), provider.close && (await provider.close(), await web3Modal.clearCachedProvider(), provider = null), selectedAccount = null, document.querySelector(".prepare")
        .style.display = "block", document.querySelector(".connected")
        .style.display = "none", document.querySelector(".balance")
        .style.display = "none", document.getElementsByClassName("HasMintedButton")[0].style.display = "none";
}
window.addEventListener("load", async () => {
    init()
});


async function generateArt(_title, _link, ImageUrl, description) {
    const _galleryParent = document.getElementById("GalleryParent");
    
    const div = document.createElement("div");
    div.classList.add("col-md-3");
    _galleryParent.append(div);
    
    const div2 = document.createElement("div");
    div2.classList.add("card", "mb-4", "box-shadow");
    div.append(div2);
    
    const div3 = document.createElement("div");
    div3.classList.add("card-img-top");
    div3.style.backgroundImage = "url('" + ImageUrl + "')";
    div2.append(div3);
    
    const div4 = document.createElement("div");
    div4.classList.add("card-body");
    div2.append(div4);
    
    
    const textTitle = document.createElement("p");
    textTitle.classList.add("card-text", "font-weight-bold");
    textTitle.innerHTML = _title;
    div4.append(textTitle);
    
    
    const text = document.createElement("p");
    text.classList.add("card-text");
    text.innerHTML = description.slice(0, 60) + " ...";
    div4.append(text);
    
    const div6 = document.createElement("div");
    div6.classList.add("d-flex", "justify-content-between", "align-items-center");
    div4.append(div6);
    
    const link = document.createElement("a");
    link.href = _link;
    div6.append(link);
    
    const button = document.createElement("button");
    button.classList.add("btn", "btn-primary");
    button.innerHTML = "View in market";
    link.append(button);
};


async function manualAddressInput() {

    deleteChild();
    const walletAddress = document.getElementById("manualWallet")
        .value;
        if(walletAddress == ""){

            error_msg("Please fill wallet address");
        }
    const options = {
        method: 'GET'
        , url: 'https://api.opensea.io/api/v1/assets'
        , params: {
            owner: walletAddress
            , order_direction: 'desc'
            , limit: '20'
            , include_orders: 'false'
        }
        , headers: {
            accept: 'application/json'
            , 'X-API-KEY': '6f77ff2a8d164976af7639539e5a4688'
        }
    };
    
    axios
        .request(options)
        .then(function (response) {
            
            console.log([0]);
            
            const _galleryRoot = document.getElementById("GalleryParent")
                .parentElement.parentElement;
            _galleryRoot.style.display = "block";
            
            response.data['assets'].forEach(element => {
                console.log(element['image_url']);
                
                generateArt(element['name'], element['permalink'], element['image_url'], element['description']);
                
            });
            
        })
        .catch(function (error) {
            console.error(error);
        });
    
}

function deleteChild() {
    var e = document.getElementById("GalleryParent");
    

    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
}

