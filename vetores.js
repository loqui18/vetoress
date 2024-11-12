import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.Random;

public class SortingBenchmark {

    public static void main(String[] args) {
        int[] sizes = {10, 100, 1000, 10000, 100000, 1000000};
        long maxExecutionTime = 5 * 60 * 1000; // 5 minutos em milissegundos

        try (FileWriter csvWriter = new FileWriter("sorting_times.csv")) {
            csvWriter.append("Algorithm,Array Size,Order,Time (ms)\n");

            for (int size : sizes) {
                System.out.println("Tamanho do vetor: " + size);

                int[] randomArray = generateRandomArray(size);
                int[] sortedArray = generateSortedArray(size);
                int[] reverseSortedArray = generateReverseSortedArray(size);

                // Bubble Sort
                measureAndWriteExecutionTime("BubbleSort", randomArray, sortedArray, reverseSortedArray, maxExecutionTime, SortingBenchmark::bubbleSort, csvWriter);

                // Insertion Sort
                measureAndWriteExecutionTime("InsertionSort", randomArray, sortedArray, reverseSortedArray, maxExecutionTime, SortingBenchmark::insertionSort, csvWriter);

                // Selection Sort
                measureAndWriteExecutionTime("SelectionSort", randomArray, sortedArray, reverseSortedArray, maxExecutionTime, SortingBenchmark::selectionSort, csvWriter);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void measureAndWriteExecutionTime(String algorithmName, int[] randomArray, int[] sortedArray, int[] reverseSortedArray, long maxExecutionTime, SortingAlgorithm algorithm, FileWriter csvWriter) throws IOException {
        long startTime, endTime, duration;

        System.out.println(algorithmName + " - Vetor desordenado:");
        startTime = System.currentTimeMillis();
        algorithm.sort(Arrays.copyOf(randomArray, randomArray.length));
        endTime = System.currentTimeMillis();
        duration = endTime - startTime;
        System.out.println("Tempo de execução: " + duration + " ms");
        csvWriter.append(String.format("%s,%d,%s,%d\n", algorithmName, randomArray.length, "Desordenado", duration));

        if (duration > maxExecutionTime) {
            System.out.println("Tempo de execução excedeu 5 minutos.");
            return;
        }

        System.out.println(algorithmName + " - Vetor ordenado:");
        startTime = System.currentTimeMillis();
        algorithm.sort(Arrays.copyOf(sortedArray, sortedArray.length));
        endTime = System.currentTimeMillis();
        duration = endTime - startTime;
        System.out.println("Tempo de execução: " + duration + " ms");
        csvWriter.append(String.format("%s,%d,%s,%d\n", algorithmName, sortedArray.length, "Ordenado", duration));

        System.out.println(algorithmName + " - Vetor ordenado inversamente:");
        startTime = System.currentTimeMillis();
        algorithm.sort(Arrays.copyOf(reverseSortedArray, reverseSortedArray.length));
        endTime = System.currentTimeMillis();
        duration = endTime - startTime;
        System.out.println("Tempo de execução: " + duration + " ms");
        csvWriter.append(String.format("%s,%d,%s,%d\n", algorithmName, reverseSortedArray.length, "Ordenado Inversamente", duration));
    }

    private static int[] generateRandomArray(int size) {
        Random rand = new Random();
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = rand.nextInt();
        }
        return array;
    }

    private static int[] generateSortedArray(int size) {
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = i;
        }
        return array;
    }

    private static int[] generateReverseSortedArray(int size) {
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = size - i;
        }
        return array;
    }

    private static void bubbleSort(int[] array) {
        int n = array.length;
        boolean swapped;
        do {
            swapped = false;
            for (int i = 1; i < n; i++) {
                if (array[i - 1] > array[i]) {
                    int temp = array[i - 1];
                    array[i - 1] = array[i];
                    array[i] = temp;
                    swapped = true;
                }
            }
            n--;
        } while (swapped);
    }

    private static void insertionSort(int[] array) {
        for (int i = 1; i < array.length; i++) {
            int key = array[i];
            int j = i - 1;
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                j--;
            }
            array[j + 1] = key;
        }
    }

    private static void selectionSort(int[] array) {
        for (int i = 0; i < array.length - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < array.length; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            int temp = array[minIndex];
            array[minIndex] = array[i];
            array[i] = temp;
        }
    }

    @FunctionalInterface
    private interface SortingAlgorithm {
        void sort(int[] array);
    }
}
