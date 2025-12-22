<?php
namespace yii\CurrencyConverter\Provider;

class YahooApi implements ProviderInterface
{
    /**
     * Url where Curl request is made
     *
     * @var strig
     */
    const API_URL = 'http://download.finance.yahoo.com/d/quotes.csv?s=[fromCurrency][toCurrency]=X&f=nl1d1t1';

    /**
     * {@inheritDoc}
     */
    public function getRate($fromCurrency, $toCurrency)
    {
        if( (!empty($fromCurrency) && !empty($toCurrency) ) && ($fromCurrency != $toCurrency) )
        {
            /*
            $get = file_get_contents("https://finance.google.com/finance/converter?a=1&from=$fromCurrency&to=$toCurrency");
            $get = explode("<span class=bld>",$get);
            $get = explode("</span>",$get[1]);
            $converted_currency = preg_replace("/[^0-9\.]/", null, $get[0]);
            */
             $url = "http://www.xe.com/currencyconverter/convert/?Amount=1&From=$fromCurrency&To=$toCurrency";
             $rawdata = file_get_contents($url);
             $data = explode('uccResultAmount', $rawdata);
             @$data = explode('uccToCurrencyCode', $data[1]);
             $amount = preg_replace('/[^0-9,.]/', '', $data[0]);
            return $amount;
        }
        else
        {
            return 1;
        }
    }
}
