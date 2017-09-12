/**
 */
var Dictionary = {
	// 字典缓存
	cache: {

	},
	/**
	 * 根据数据字典编码获得对应字典项信息
	 * 
	 * @param {}
	 *            code 字典编码
	 * @param {}
	 *            onSuccess 获取成功回调函数
	 * @param {}
	 *            onFault 获取失败回调函数
	 * @param {}
	 *            onComplete 获取完成回调函数
	 */
	get: function(code, onSuccess, onFault, onComplete) {
		var _this = this;
		// 判断字典编码是否存在
		if (!code) {
			if ($.isFunction(onFault)) {
				onFault();
			}
			return null;
		}
		// 判断是否缓存字典信息
		if (_this.cache.hasOwnProperty(code)) {
			var data = _this.cache[code] ||  {};
			if ($.isFunction(onSuccess)) {
				onSuccess(data);
			}
			if ($.isFunction(onComplete)) {
				onComplete();
			}
            return data;
		}
	},
	
	/**
	 * 获得字典对应字典项文本
	 * @param {} code	字典编码
	 * @param {} value	字典项编码
	 */
	text: function(code, value) {
		var _this = this;
		// 字典项文本
		var libarayText = '';
		// 判断字典编码是否存在
		if (!code || !value) return libarayText;
		// 判断是否缓存字典信息
		if (_this.cache.hasOwnProperty(code) && _this.cache[code].hasOwnProperty(value)) {
			libarayText = _this.cache[code][value] || '';
		}
		return libarayText;
	},
	
	/**
	 * 加载字典到下拉框对象中，加载包含data-dictionary属性的项
	 * @param {} $dictionary	待加载字典对象[可选]
	 * 				data-dictionary/data-dictionary-key/data-dictionary-default 默认配置，分别表示字典编码、项值对应键、初始化默认项值
	 * @param {} complete		全部加载完成执行
	 */
	load: function() {
		var _this = this;
		
		// 解析参数
		var $dictionary = $('[data-dictionary]'), complete = null;
		if (arguments.length > 0) {
			if (arguments[0].jquery) {
				$dictionary = arguments[0];
				complete = arguments[1];
			} else {
				complete = arguments[0];
			}
		}

		// 判断需加载字典个数
		var surplusLoads = $dictionary.length;
		// 判断是否已经全部加载
		if (surplusLoads == 0 && $.isFunction(complete)) {
			complete();
			return;
		}
		
		/**
		 * 加载字典项
		 * @param {} domEl DOM节点
		 */
		var loadOptions = function(domEl) {
			// 获得jQuery对象
			var $this = $(domEl);
			// 获得字典编码
			var code = $this.attr('data-dictionary') ||  $this.attr('name') || '';
			// 项值对应键，编码：0，文本：1，默认使用0
			var key = $this.attr("data-dictionary-key");
			// 获得初始默认值
			var defaultValue = $this.attr("data-dictionary-default");
			
			/**
			 * 获得字典项成功回调函数
			 * @param {Array} datas 字典项信息
			 */
			var onSuccess = function(data) {
				if($this.find('option').length > 1)return false;
				for (var id in data) {
					var text = data[id];
					// 创建字典项
					var $option = $('<option/>').val(id).html(text);
					// 判断是否使用文本做为值
					if (key == '1') {
						$option.val(text);
					}
					// 追加字典项到下拉框中
					$this.append($option);
				}
				// 判断是否默认选中项
				if (!(defaultValue)) {
					$this.children('option[value="' + defaultValue + '"]')
							.prop('selected', true).siblings('option').prop(
									'selected', false);
				}
                $this.trigger('change');
			};
			
			/**
			 * 加载完成执行
			 */
			var onComplete = function() {
				surplusLoads--;
				// 判断是否已经全部加载
				if (surplusLoads == 0 && $.isFunction(complete)) {
					complete();
				}
			};
			
			// 获得字典数据，并设置到下拉框中
			_this.get(code, onSuccess, null, onComplete);
		};
		
		// 加载所有字典项
		$dictionary.each(function(){
			loadOptions(this);
		});
	}
};