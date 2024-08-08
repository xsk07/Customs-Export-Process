	var m_MainDictionary;
	var m_Debug = false;

	function Cache(){
		this.Flush = GlobalFlushCache;
		this.Add = GlobalAdd;
		this.GetData = GlobalGetData;
		this.RemoveKey = GlobalRemoveKey;
		this.RemovePrefix = GlobalRemovePrefix;
		this.ContainsPrefix = GlobalContainsPrefix;
		this.ContainsKey = GlobalContainsKey;
		m_MainDictionary = new Hashtable();
	}

	function GlobalFlushCache(){
		var prefixes = m_MainDictionary.keys();
		for (var i = 0; i < prefixes.length; i++){
			var prefix = prefixes[i];
			var prefixCache = m_MainDictionary.get(prefix);
			prefixCache.clear();
		}
		m_MainDictionary.clear();
	}
	
	function GlobalAdd(prefix, key, keyData){
			if (m_MainDictionary.containsKey(prefix)){
				var prefixCache = m_MainDictionary.get(prefix);
				prefixCache.put(key, keyData);
			}
			else{
				var prefixCache = new Hashtable();
				prefixCache.put(key, keyData);
				m_MainDictionary.put(prefix, prefixCache);
			}
			Debug("GlobalAdd(" + prefix + "," + key + ", " + keyData + ") :" + m_MainDictionary.size());
	}

	function GlobalGetData(prefix, key){
		if (m_MainDictionary.containsKey(prefix) ){
			var prefixCache = m_MainDictionary.get(prefix);
			if (prefixCache != null && prefixCache.containsKey(key)){
				Debug ("GetData(" + prefix + "," + key +") : " + prefixCache.get(key) );
				return prefixCache.get(key);
			}
		}
		return null;
	}

	function GlobalRemoveKey(prefix, key){
		if (m_MainDictionary.containsKey(prefix)){
			var prefixCache = m_MainDictionary.get(prefix);
			if (prefixCache != null && prefixCache.containsKey(key)){
				prefixCache.remove(key);
			}
		}
	}

	function GlobalContainsKey(prefix, key){
		if (m_MainDictionary.containsKey(prefix)){
			var prefixCache = m_MainDictionary.get(prefix);
			if (prefixCache != null){
				return prefixCache.containsKey(key);
			}
		}
	}

	function GlobalRemovePrefix(prefix){
		if (m_MainDictionary.containsKey(prefix)){
			var prefixCache = m_MainDictionary.get(prefix);
			if (prefixCache != null){
				prefixCache.clear();
				m_MainDictionary.remove(prefix);
				Debug("GlobalRemovePrefix");
			}
		}
	}
	
	function GlobalContainsPrefix(key){
		return m_MainDictionary.containsKey(key);
	}
	/* End Global Cache */
	
	function GetPrefix(){
		var idForm = document.getElementById("h_idForm");
		var idCase = document.getElementById("h_idCase");
		var prefix = "";
		if (idCase != null && idCase.value.length > 0)
			prefix = idCase.value + "_";
		
		if (idForm != null && idForm.value.length > 0)
			prefix += idForm.value;
		else
			prefix += "idForm";
			
		Debug("prefix: " + prefix);
		return prefix;
	}	

	function GetCache(){
		//return null;
		//retrieve the localCache variable setted on the menu frame
		try{
			return parent.BALocationFrame.localCache;
			//window.parent.frames[0].localCache;
		}
		catch (err) {
			return isDefined("localCache") ? localCache : null;
		}
	}

	function isDefined(variable) {
		 return typeof (window[variable]) != "undefined";
	}

	function GetValueOnCache(key){ /**/
		var oValue = GetValue(key);
		//return oValue;
		Debug ("GetValueOnCache oValue: " + oValue);
		if (oValue == null || oValue == 0){
			oValue = cache.GetData(key);
			if (oValue == null)
				return GetValue(key);
		}
		return oValue;
	}
	
	/*Begin Page Cache */	
	function PageCache(){
		this.cache = GetCache();
		Debug("Cache:" + this.cache);
		if (this.cache != null){
			Debug ("Cache is not null");
			this.Add = PageAdd;
			this.GetData = PageGetData;
			this.Remove = PageRemove;
			this.ContainsKey = PageContainsKey;
		}
		else{
			Debug ("Cache is null");
			this.Add = CacheDisabled;
			this.GetData = CacheDisabled;
			this.Remove = CacheDisabled;
			this.ContainsKey = CacheDisabled;
		}
		this.prefix = GetPrefix();
	}

	function PageAdd(key, value){
		this.cache.Add(this.prefix, key, value);
	}

	function PageGetData(key){
		Debug ("GetFromCache: " + this.cache.GetData(this.prefix, key));
		return this.cache.GetData(this.prefix, key);
	}

	function PageRemove(){
		if (this.cache != null)
			this.cache.RemovePrefix(this.prefix);
	}
	
	function PageContainsKey(key){
		if (this.cache != null)
		{
			if(this.cache.ContainsKey(this.prefix, key))
			    return true;
			else
			    return false;
		}
	}
	
	function CacheDisabled(){
		Debug("CacheDisabled");
		return null;
	}
	/* End page Cache */
	
	function Debug(sMessage){
		if (m_Debug)
			alert(sMessage);
	}