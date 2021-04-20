import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [licenseData, setData] = useState([]);
  const [licenseProduct, setProduct] = useState([]);
  const [licenseGroup, setGroup] = useState([]);

  useEffect(() => {
    fetch("https://607692f21ed0ae0017d69403.mockapi.io/Serial")
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

  useEffect(() => {
    fetch("https://607692f21ed0ae0017d69403.mockapi.io/Product")
      .then((response) => response.json())
      .then((json) => setProduct(json));
  }, []);
  useEffect(() => {
    fetch("https://607692f21ed0ae0017d69403.mockapi.io/Group")
      .then((response) => response.json())
      .then((json) => setGroup(json));
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    const license = licenseData.find((o) => o.serialNo == data);

    if (license) {
      const product = licenseProduct.find((x) => x.id == license.productId);
      const group = licenseGroup.find((x) => x.id == product.groupId);
      alert(
        "Ürününüz Lisanslı Trabzonspor Ürünüdür!" +
          "\nSeri Numarası: " +
          license.serialNo +
          "\nLisans Basım Yılı: " +
          license.printYear +
          "\nÜrün Adı: " +
          product.productName +
          "\nÜrün Grubu: " +
          group.groupName
      );
    } else {
      alert("Ürününüz Lisanslı Değildir!");
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Kamera izni talep ediliyor</Text>
      </SafeAreaView>
    );
  }
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Kamera erişimi sağlanamadı</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button
          title={"Tekrar taramak için ekrana dokunun"}
          onPress={() => setScanned(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
